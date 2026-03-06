import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { SubjectChip } from './SubjectChip';
import { Clock, ChevronRight } from 'lucide-react-native';

interface AulaCardProps {
    id: string;
    courseName: string;
    courseColor: string;
    startTime: string;
    endTime: string;
    title?: string;
    onPress?: (id: string) => void;
    isActive?: boolean;
}

export function AulaCard({
    id,
    courseName,
    courseColor,
    startTime,
    endTime,
    title,
    onPress,
    isActive = false
}: AulaCardProps) {

    return (
        <View style={styles.wrapper}>
            {/* Indicador de Timeline Lateral */}
            <View style={styles.timelineColumn}>
                <View style={[styles.timelineDot, isActive && { backgroundColor: theme.colors.accent, borderColor: theme.colors.accentLight }]} />
                <View style={[styles.timelineLine, isActive && { backgroundColor: theme.colors.accent }]} />
            </View>

            {/* Cartão em si */}
            <TouchableOpacity
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => onPress && onPress(id)}
                activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <SubjectChip name={courseName} colorHex={courseColor} size="small" />

                    <View style={styles.timeContainer}>
                        <Clock color={theme.colors.textSecondary} size={12} style={{ marginRight: 4 }} />
                        <Text style={styles.timeText}>{startTime} - {endTime}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.classTitle} numberOfLines={2}>
                        {title ? title : 'Sem anotações para esta aula'}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Ver mais</Text>
                    <ChevronRight color={theme.colors.textSecondary} size={16} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    timelineColumn: {
        width: 30,
        alignItems: 'center',
        paddingTop: 8,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        zIndex: 2,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: theme.colors.border,
        marginTop: -4,
        marginBottom: -16, // Conecta com o próximo dot
        zIndex: 1,
    },
    card: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardActive: {
        borderColor: theme.colors.accentBg,
        backgroundColor: theme.colors.surfaceElevated,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    timeText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    body: {
        marginBottom: 16,
    },
    classTitle: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textPrimary,
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 12,
    },
    footerText: {
        fontFamily: theme.typography.fontFamilies.medium,
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
    }
});
