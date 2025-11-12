import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { claimCard } from '../services/walletService';
import { DeepLinkParams } from '../utils/deepLinking';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/config';

interface AddCardScreenProps {
    route: any;
    navigation: any;
}

export default function AddCardScreen({ route, navigation }: AddCardScreenProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const params = route.params as DeepLinkParams;

    useEffect(() => {
        handleClaimCard();
    }, []);

    const handleClaimCard = async () => {
        if (!params?.token) {
            setError('Token no encontrado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await claimCard(params.token, params.ticketUrl);
            setSuccess(true);

            // Auto-navegar después de 2 segundos
            setTimeout(() => {
                navigation.navigate('CardList');
            }, 2000);
        } catch (err: any) {
            console.error('Error claiming card:', err);
            setError(err.message || 'Error al agregar la tarjeta');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color={COLORS.blue600} />
                        <Text style={styles.loadingText}>Agregando tu tarjeta...</Text>
                    </>
                ) : error ? (
                    <>
                        <Ionicons name="close-circle" size={64} color={COLORS.red500} />
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <Button
                            title="Volver"
                            onPress={() => navigation.navigate('CardList')}
                            style={styles.button}
                        />
                    </>
                ) : success ? (
                    <>
                        <Ionicons name="checkmark-circle" size={64} color={COLORS.green500} />
                        <Text style={styles.successTitle}>¡Tarjeta agregada!</Text>
                        <Text style={styles.successText}>
                            Tu tarjeta se ha agregado correctamente
                        </Text>
                        <Text style={styles.redirectText}>
                            Redirigiendo a tus tarjetas...
                        </Text>
                    </>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.lg,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
    },
    errorTitle: {
        marginTop: SPACING.lg,
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
    },
    errorText: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
        textAlign: 'center',
    },
    successTitle: {
        marginTop: SPACING.lg,
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
    },
    successText: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
        textAlign: 'center',
    },
    redirectText: {
        marginTop: SPACING.md,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray500,
        textAlign: 'center',
    },
    button: {
        marginTop: SPACING.lg,
    },
});

