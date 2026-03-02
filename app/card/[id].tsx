import { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
    TextInput,
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import * as cardRepo from '../../src/db/repositories/cards';
import * as subjectRepo from '../../src/db/repositories/subjects';
import * as snippetRepo from '../../src/db/repositories/snippets';
import * as linkRepo from '../../src/db/repositories/links';
import type { Card, Subject, CodeSnippet, Link as LinkType } from '../../src/types';
import * as Clipboard from 'expo-clipboard';
import { Linking } from 'react-native';

const LANGUAGES = ['javascript', 'html', 'css', 'python', 'java'];

export default function CardScreen() {
    const { c } = useTheme();
    const { id, date } = useLocalSearchParams<{ id: string; date: string }>();
    const subjectId = parseInt(id as string);
    const dateStr = date as string;

    const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'links'>('notes');
    const [subject, setSubject] = useState<Subject | null>(null);
    const [card, setCard] = useState<Card | null>(null);
    const [notes, setNotes] = useState('');
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
    const [links, setLinks] = useState<LinkType[]>([]);

    // New snippet form
    const [showSnippetForm, setShowSnippetForm] = useState(false);
    const [snippetTitle, setSnippetTitle] = useState('');
    const [snippetLang, setSnippetLang] = useState('javascript');
    const [snippetCode, setSnippetCode] = useState('');

    // New link form
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTag, setLinkTag] = useState('');

    const [copied, setCopied] = useState<number | null>(null);
    const saveTimeout = { current: null as any };

    const loadCard = useCallback(async () => {
        const sub = await subjectRepo.getSubjectById(subjectId);
        setSubject(sub);

        const c = await cardRepo.getOrCreateCard(subjectId, dateStr);
        setCard(c);
        setNotes(c.notes || '');

        const snips = await snippetRepo.getSnippetsByCard(c.id);
        setSnippets(snips);

        const lnks = await linkRepo.getLinksByCard(c.id);
        setLinks(lnks);
    }, [subjectId, dateStr]);

    useFocusEffect(useCallback(() => { loadCard(); }, [loadCard]));

    const handleNotesChange = (text: string) => {
        setNotes(text);
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(async () => {
            if (card) await cardRepo.updateCardNotes(card.id, text);
        }, 1000);
    };

    const handleAddSnippet = async () => {
        if (!card || !snippetCode.trim()) return;
        await snippetRepo.createSnippet({
            card_id: card.id,
            title: snippetTitle.trim(),
            language: snippetLang,
            code: snippetCode,
        });
        setSnippetTitle('');
        setSnippetCode('');
        setShowSnippetForm(false);
        await loadCard();
    };

    const handleCopyCode = async (code: string, snippetId: number) => {
        await Clipboard.setStringAsync(code);
        setCopied(snippetId);
        setTimeout(() => setCopied(null), 1500);
    };

    const handleDeleteSnippet = async (snippetId: number) => {
        await snippetRepo.deleteSnippet(snippetId);
        await loadCard();
    };

    const handleAddLink = async () => {
        if (!card || !linkUrl.trim()) return;
        await linkRepo.createLink({
            card_id: card.id,
            title: linkTitle.trim() || linkUrl.trim(),
            url: linkUrl.trim(),
            tag: linkTag,
        });
        setLinkTitle('');
        setLinkUrl('');
        setLinkTag('');
        setShowLinkForm(false);
        await loadCard();
    };

    const handleDeleteLink = async (linkId: number) => {
        await linkRepo.deleteLink(linkId);
        await loadCard();
    };

    const tabs = [
        { key: 'notes' as const, label: 'Anotações' },
        { key: 'code' as const, label: 'Código' },
        { key: 'links' as const, label: 'Links' },
    ];

    const formatDate = (d: string) => {
        const [y, m, day] = d.split('-');
        return `${day}/${m}/${y}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={c.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[styles.colorDot, { backgroundColor: subject?.color || c.accent }]} />
                        <Text style={[typography.h2, { color: c.textPrimary }]} numberOfLines={1}>
                            {subject?.name || 'Carregando...'}
                        </Text>
                    </View>
                    <Text style={[typography.caption, { color: c.textSecondary }]}>
                        {formatDate(dateStr)}
                    </Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={[styles.tabBar, { borderBottomColor: c.border }]}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && { borderBottomColor: c.accent, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[typography.bodySmall, {
                            color: activeTab === tab.key ? c.accent : c.textTertiary,
                            fontFamily: activeTab === tab.key ? 'Inter_600SemiBold' : 'Inter_400Regular',
                        }]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
                {/* NOTES TAB */}
                {activeTab === 'notes' && (
                    <TextInput
                        style={[styles.notesInput, { color: c.textPrimary }]}
                        multiline
                        placeholder="O que foi discutido na aula de hoje?"
                        placeholderTextColor={c.textTertiary}
                        value={notes}
                        onChangeText={handleNotesChange}
                        textAlignVertical="top"
                    />
                )}

                {/* CODE TAB */}
                {activeTab === 'code' && (
                    <>
                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: c.accent }]}
                            onPress={() => setShowSnippetForm(true)}
                        >
                            <Ionicons name="add" size={18} color={c.accent} />
                            <Text style={[typography.bodySmall, { color: c.accent, marginLeft: spacing.xs }]}>
                                Novo bloco de código
                            </Text>
                        </TouchableOpacity>

                        {showSnippetForm && (
                            <View style={[styles.formCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                                    placeholder="Título (opcional)"
                                    placeholderTextColor={c.textTertiary}
                                    value={snippetTitle}
                                    onChangeText={setSnippetTitle}
                                />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
                                    {LANGUAGES.map((lang) => (
                                        <TouchableOpacity
                                            key={lang}
                                            style={[styles.langChip, {
                                                backgroundColor: snippetLang === lang ? c.accentBg : c.background,
                                                borderColor: snippetLang === lang ? c.accent : c.border,
                                            }]}
                                            onPress={() => setSnippetLang(lang)}
                                        >
                                            <Text style={[typography.caption, {
                                                color: snippetLang === lang ? c.accent : c.textSecondary,
                                            }]}>
                                                {lang}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <TextInput
                                    style={[styles.codeInput, { backgroundColor: c.codeBackground, color: '#F5F5F7', borderColor: c.border }]}
                                    multiline
                                    placeholder="// Cole ou digite seu código aqui..."
                                    placeholderTextColor="#636366"
                                    value={snippetCode}
                                    onChangeText={setSnippetCode}
                                    textAlignVertical="top"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <View style={styles.formActions}>
                                    <TouchableOpacity
                                        style={[styles.formButton, { backgroundColor: c.background }]}
                                        onPress={() => setShowSnippetForm(false)}
                                    >
                                        <Text style={[typography.bodySmall, { color: c.textSecondary }]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.formButton, { backgroundColor: c.accent }]}
                                        onPress={handleAddSnippet}
                                    >
                                        <Text style={[typography.bodySmall, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {snippets.map((snippet) => (
                            <View key={snippet.id} style={[styles.snippetCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                                <View style={styles.snippetHeader}>
                                    <Text style={[typography.bodySmall, { color: c.textSecondary, flex: 1 }]}>
                                        {snippet.title || 'Sem título'}
                                    </Text>
                                    <View style={[styles.langBadge, { backgroundColor: c.accentBg }]}>
                                        <Text style={[typography.caption, { color: c.accent }]}>{snippet.language}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleCopyCode(snippet.code, snippet.id)} style={{ marginLeft: 8 }}>
                                        <Ionicons name={copied === snippet.id ? 'checkmark' : 'copy-outline'} size={18} color={copied === snippet.id ? c.success : c.textTertiary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteSnippet(snippet.id)} style={{ marginLeft: 8 }}>
                                        <Ionicons name="trash-outline" size={18} color={c.danger} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.codeBlock, { backgroundColor: c.codeBackground }]}>
                                    <Text style={[typography.code, { color: '#F5F5F7' }]}>{snippet.code}</Text>
                                </View>
                            </View>
                        ))}

                        {snippets.length === 0 && !showSnippetForm && (
                            <View style={styles.emptyState}>
                                <Ionicons name="code-slash-outline" size={40} color={c.textTertiary} />
                                <Text style={[typography.bodySmall, { color: c.textTertiary, marginTop: spacing.sm }]}>
                                    Nenhum bloco de código ainda
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {/* LINKS TAB */}
                {activeTab === 'links' && (
                    <>
                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: c.accent }]}
                            onPress={() => setShowLinkForm(true)}
                        >
                            <Ionicons name="add" size={18} color={c.accent} />
                            <Text style={[typography.bodySmall, { color: c.accent, marginLeft: spacing.xs }]}>
                                Adicionar link
                            </Text>
                        </TouchableOpacity>

                        {showLinkForm && (
                            <View style={[styles.formCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary }]}
                                    placeholder="https://..."
                                    placeholderTextColor={c.textTertiary}
                                    value={linkUrl}
                                    onChangeText={setLinkUrl}
                                    autoCapitalize="none"
                                    keyboardType="url"
                                    autoFocus
                                />
                                <TextInput
                                    style={[styles.input, { backgroundColor: c.background, borderColor: c.border, color: c.textPrimary, marginTop: spacing.sm }]}
                                    placeholder="Título do link"
                                    placeholderTextColor={c.textTertiary}
                                    value={linkTitle}
                                    onChangeText={setLinkTitle}
                                />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
                                    {['documentação', 'tutorial', 'exercício', 'outro'].map((tag) => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[styles.langChip, {
                                                backgroundColor: linkTag === tag ? c.accentBg : c.background,
                                                borderColor: linkTag === tag ? c.accent : c.border,
                                            }]}
                                            onPress={() => setLinkTag(linkTag === tag ? '' : tag)}
                                        >
                                            <Text style={[typography.caption, { color: linkTag === tag ? c.accent : c.textSecondary }]}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <View style={styles.formActions}>
                                    <TouchableOpacity
                                        style={[styles.formButton, { backgroundColor: c.background }]}
                                        onPress={() => setShowLinkForm(false)}
                                    >
                                        <Text style={[typography.bodySmall, { color: c.textSecondary }]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.formButton, { backgroundColor: c.accent }]}
                                        onPress={handleAddLink}
                                    >
                                        <Text style={[typography.bodySmall, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Salvar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {links.map((link) => (
                            <TouchableOpacity
                                key={link.id}
                                style={[styles.linkCard, { backgroundColor: c.surface, borderColor: c.border }]}
                                onPress={() => Linking.openURL(link.url)}
                                onLongPress={() => handleDeleteLink(link.id)}
                            >
                                <Ionicons name="link" size={18} color={c.accent} />
                                <View style={styles.linkContent}>
                                    <Text style={[typography.body, { color: c.textPrimary }]} numberOfLines={1}>{link.title}</Text>
                                    <Text style={[typography.caption, { color: c.textTertiary }]} numberOfLines={1}>{link.url}</Text>
                                </View>
                                {link.tag && (
                                    <View style={[styles.langBadge, { backgroundColor: c.accentBg }]}>
                                        <Text style={[typography.caption, { color: c.accent }]}>{link.tag}</Text>
                                    </View>
                                )}
                                <Ionicons name="open-outline" size={16} color={c.textTertiary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        ))}

                        {links.length === 0 && !showLinkForm && (
                            <View style={styles.emptyState}>
                                <Ionicons name="link-outline" size={40} color={c.textTertiary} />
                                <Text style={[typography.bodySmall, { color: c.textTertiary, marginTop: spacing.sm }]}>
                                    Nenhum link salvo ainda
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingTop: spacing.xl, gap: spacing.md },
    headerContent: { flex: 1 },
    colorDot: { width: 12, height: 12, borderRadius: 6 },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: spacing.md },
    tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
    content: { flex: 1 },
    contentInner: { padding: spacing.md, paddingBottom: 100 },
    notesInput: { flex: 1, fontSize: 16, fontFamily: 'Inter_400Regular', lineHeight: 24, minHeight: 300 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', marginBottom: spacing.md },
    formCard: { borderRadius: 12, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
    input: { padding: spacing.sm, borderRadius: 8, borderWidth: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
    langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, marginRight: 6 },
    codeInput: { marginTop: spacing.sm, padding: spacing.md, borderRadius: 8, borderWidth: 1, fontSize: 14, fontFamily: 'JetBrainsMono_400Regular', minHeight: 120 },
    formActions: { flexDirection: 'row', gap: 12, marginTop: spacing.md },
    formButton: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center' },
    snippetCard: { borderRadius: 12, borderWidth: 1, marginBottom: spacing.md, overflow: 'hidden' },
    snippetHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, paddingHorizontal: spacing.md },
    langBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    codeBlock: { padding: spacing.md },
    linkCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm, gap: spacing.sm },
    linkContent: { flex: 1 },
    emptyState: { alignItems: 'center', paddingTop: 60 },
});
