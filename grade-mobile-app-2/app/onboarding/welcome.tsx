import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../../src/theme';
import PrimaryButton from '../../src/components/PrimaryButton';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🎓</Text>
                <Text style={styles.title}>Grade</Text>
                <Text style={styles.subtitle}>
                    Organize suas aulas, anotações e prazos em um só lugar.
                </Text>
            </View>

            <View style={styles.footer}>
                <PrimaryButton
                    label="Começar"
                    onPress={() => router.push('/onboarding/name')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 80,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.headingXl,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 280,
    },
    footer: {
        paddingBottom: spacing.xxl,
    },
});
