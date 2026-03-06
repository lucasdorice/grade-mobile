import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme';
import { ArrowLeft, Check, Code, ClipboardList } from 'lucide-react-native';
import { SubjectChip } from '../../components/SubjectChip';
import { fetchCardForCourseAndDate, fetchBlocksForCard, insertClassCard, saveBlocksForCard } from '../../database/queries';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function ClassScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { scheduleId, courseId, courseName, courseColor, startTime, endTime } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState<string | null>(null);

    // O Pell Editor lida melhor com uma única string HTML do que arrays de blocos
    const [htmlContent, setHtmlContent] = useState<string>("");
    const richText = React.useRef<RichEditor>(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        setIsLoading(true);
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const card = await fetchCardForCourseAndDate(courseId, todayStr);
            if (card) {
                setCardId(card.id);
                const fetchedBlocks = await fetchBlocksForCard(card.id);
                // Concatenamos os velhos blocos legados (texto puro) como págrafos HTML iniciais se existirem.
                // Novos saves já serão um único bloco 100% HTML renderizado via PellEditor.
                if (fetchedBlocks.length > 0) {
                    const legacyMerge = fetchedBlocks.map((b: any) => b.content).join('<br>');
                    setHtmlContent(legacyMerge);
                } else {
                    setHtmlContent("");
                }
            } else {
                setCardId(`card_${Date.now()}`);
                setHtmlContent("");
            }
        } catch (error) {
            console.error("Erro ao carregar notas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const contentHTML = await richText.current?.getContentHtml();

            const existingCard = await fetchCardForCourseAndDate(courseId, todayStr);
            let finalCardId = cardId!;

            if (!existingCard) {
                await insertClassCard(finalCardId, courseId, 'Anotações', todayStr);
            }

            // Transformamos o HTML gerado em um único Master Block para persistência
            const payload = [{ id: 'b_' + Date.now(), type: 'html', content: contentHTML || '' }];
            await saveBlocksForCard(finalCardId, payload);

            navigation.goBack();
        } catch (error) {
            console.error("Falha ao salvar:", error);
        }
    };

    const handleInsertCode = () => {
        richText.current?.focusContentEditor();
        setTimeout(() => {
            richText.current?.insertHTML('<pre style="background-color: #2D3436; color: #FFF; padding: 12px; border-radius: 8px; font-family: monospace;">// Escreva seu código aqui...</pre><p><br></p>');
        }, 100);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ArrowLeft color={theme.colors.textPrimary as any} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
                        <Check color={theme.colors.accent as any} size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerTitleWrap}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SubjectChip name={courseName || 'Disciplina'} colorHex={courseColor || '#CCC'} />
                        <TouchableOpacity style={styles.taskShortcutBtn} onPress={() => navigation.navigate('CreateTask', { courseId })}>
                            <ClipboardList color={theme.colors.accent as any} size={16} />
                            <Text style={styles.taskShortcutText}>Nova Tarefa</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Anotações da Aula</Text>
                    <Text style={styles.subtitle}>Hoje • {startTime || '--:--'} - {endTime || '--:--'}</Text>
                </View>
            </View>

            {/* Editor de Blocos Avançado (WebView) */}
            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={theme.colors.accent} />
            ) : (
                <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <RichEditor
                            ref={richText}
                            style={styles.richTextEditor}
                            placeholder="Comece a digitar sua anotação... ✍️"
                            initialContentHTML={htmlContent}
                            editorStyle={{
                                backgroundColor: theme.colors.background,
                                color: theme.colors.textPrimary,
                                placeholderColor: theme.colors.textTertiary,
                                contentCSSText: `font-size: 16px; font-family: sans-serif; line-height: 1.5;`
                            }}
                            useContainer={true}
                        />
                    </ScrollView>

                    {/* Barra de Ferramentas de Formatação que sobe com Teclado na Base do App */}
                    <RichToolbar
                        editor={richText}
                        style={styles.richToolbar}
                        iconTint={theme.colors.textSecondary}
                        selectedIconTint={theme.colors.accent}
                        disabledIconTint={theme.colors.border}
                        actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.heading1,
                            actions.heading2,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.undo,
                            actions.redo,
                            'customCodeBlock' // custom feature
                        ]}
                        iconMap={{
                            ['customCodeBlock']: () => <Code color={theme.colors.textSecondary as any} size={20} />
                        }}
                        customAction={(action: string) => {
                            if (action === 'customCodeBlock') {
                                handleInsertCode();
                            }
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 48,
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
    },
    headerTitleWrap: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 8,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
        marginTop: 12,
        marginBottom: 4,
        lineHeight: 32,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.bodySmall,
        color: theme.colors.textSecondary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    richTextEditor: {
        flex: 1,
        minHeight: 400,
    },
    richToolbar: {
        backgroundColor: theme.colors.surfaceElevated,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        height: 50,
    },
    taskShortcutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${theme.colors.accent}15`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
    },
    taskShortcutText: {
        fontFamily: theme.typography.fontFamilies.medium,
        color: theme.colors.accent,
        fontSize: 12,
        marginLeft: 6,
    }
});
