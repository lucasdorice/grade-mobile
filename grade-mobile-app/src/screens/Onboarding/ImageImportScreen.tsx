import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { ChevronLeft, Image as ImageIcon, CheckCircle2, Upload } from 'lucide-react-native';
import { insertCourse, insertClassSchedule } from '../../database/queries';
import * as ImagePicker from 'expo-image-picker';

export default function ImageImportScreen() {
    const navigation = useNavigation<any>();
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
    const [pickedUri, setPickedUri] = useState<string | null>(null);

    const handlePickImage = async () => {
        // Pede permissão
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para importar a grade.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setPickedUri(uri);
        setScanState('scanning');

        // Simula processamento da IA por 3.5s e depois insere dados mock
        setTimeout(() => {
            mockDatabaseInsertion().then(() => {
                setScanState('success');
            });
        }, 3500);
    };

    const mockDatabaseInsertion = async () => {
        try {
            const ts = Date.now();
            const courses = [
                { id: `c_ai_${ts}_1`, name: 'Cálculo Numérico', color: theme.subjectColors[0], prof: 'Profa. Eliane' },
                { id: `c_ai_${ts}_2`, name: 'Física Geral II', color: theme.subjectColors[1], prof: 'Dr. Newton' },
            ];

            for (const c of courses) {
                await insertCourse(c.id, c.name, c.color, c.prof);
            }

            await insertClassSchedule(`sched_${courses[0].id}_2`, courses[0].id, 2, '08:00', '10:00');
            await insertClassSchedule(`sched_${courses[1].id}_3`, courses[1].id, 3, '10:30', '12:30');
            await insertClassSchedule(`sched_${courses[0].id}_4`, courses[0].id, 4, '08:00', '10:00');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinish = () => {
        navigation.navigate('ScheduleReadyScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    disabled={scanState === 'scanning'}
                >
                    <ChevronLeft color={theme.colors.textPrimary} size={28} />
                </TouchableOpacity>
                <View style={styles.stepperContainer}>
                    <View style={[styles.stepDot, { marginRight: 8 }]} />
                    <View style={[styles.stepDot, { marginRight: 8 }]} />
                    <View style={[styles.stepDot, styles.stepDotActive, { marginRight: 8 }]} />
                    <View style={styles.stepDot} />
                </View>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                {scanState === 'idle' && (
                    <>
                        <Text style={styles.title}>Importar grade por foto</Text>
                        <Text style={styles.subtitle}>
                            Selecione uma imagem da sua tabela de horários na galeria do celular. Nosso algoritmo vai extrair as matérias automaticamente.
                        </Text>

                        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage} activeOpacity={0.7}>
                            <Upload color={theme.colors.accent} size={48} />
                            <Text style={styles.uploadText}>Toque para abrir a Galeria</Text>
                            <View style={styles.uploadHint}>
                                <ImageIcon color={theme.colors.textTertiary} size={14} />
                                <Text style={styles.uploadHintText}>JPG, PNG ou HEIC</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {scanState === 'scanning' && (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size={64} color={theme.colors.accent} />
                        <Text style={styles.loadingTitle}>Lendo horários...</Text>
                        <Text style={styles.loadingSubtitle}>
                            Extraindo colunas e matérias da imagem selecionada. Isso leva alguns segundos.
                        </Text>
                    </View>
                )}

                {scanState === 'success' && (
                    <View style={styles.centerBox}>
                        <CheckCircle2 color={theme.colors.success} size={72} />
                        <Text style={styles.loadingTitle}>Importação Concluída!</Text>
                        <Text style={styles.loadingSubtitle}>
                            Encontramos suas matérias e criamos a programação semanal.
                        </Text>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleFinish}>
                            <Text style={styles.btnPrimaryText}>Avançar para a Grade</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    stepperContainer: {
        flexDirection: 'row',
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
    },
    stepDotActive: {
        backgroundColor: theme.colors.accent,
        width: 24,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontFamily: theme.typography.fontFamilies.bold,
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        lineHeight: 24,
        marginBottom: 40,
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        borderRadius: theme.borderRadius.lg,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceElevated,
    },
    uploadText: {
        fontFamily: theme.typography.fontFamilies.semiBold,
        color: theme.colors.accent,
        fontSize: theme.typography.sizes.body,
        marginTop: 16,
    },
    uploadHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    uploadHintText: {
        fontFamily: theme.typography.fontFamilies.regular,
        color: theme.colors.textTertiary,
        fontSize: theme.typography.sizes.caption,
        marginLeft: 6,
    },
    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -60,
    },
    loadingTitle: {
        fontFamily: theme.typography.fontFamilies.bold,
        color: theme.colors.textPrimary,
        fontSize: theme.typography.sizes.h2,
        marginTop: 24,
        marginBottom: 8,
    },
    loadingSubtitle: {
        fontFamily: theme.typography.fontFamilies.regular,
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.bodySmall,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
    },
    btnPrimary: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        marginTop: 40,
        width: '100%',
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#FFF',
        fontFamily: theme.typography.fontFamilies.semiBold,
        fontSize: theme.typography.sizes.body,
    },
});
