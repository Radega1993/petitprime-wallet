import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

export type ErrorType =
    | 'token_expired'
    | 'token_used'
    | 'connection'
    | 'server'
    | 'invalid_link'
    | 'unknown';

interface ErrorDisplayProps {
    type: ErrorType;
    title?: string;
    message?: string;
    onRetry?: () => void;
    onGoBack?: () => void;
}

const ERROR_CONFIG: Record<ErrorType, { icon: keyof typeof Ionicons.glyphMap; color: string; defaultTitle: string; defaultMessage: string }> = {
    token_expired: {
        icon: 'time-outline',
        color: COLORS.yellow600,
        defaultTitle: 'Token Expirado',
        defaultMessage: 'El link que intentaste usar ha expirado. Los links de tarjetas expiran después de 7 días por seguridad.',
    },
    token_used: {
        icon: 'checkmark-circle-outline',
        color: COLORS.blue600,
        defaultTitle: 'Tarjeta Ya Agregada',
        defaultMessage: 'Esta tarjeta ya está en tu wallet. Puedes verla en la lista de tarjetas.',
    },
    connection: {
        icon: 'cloud-offline-outline',
        color: COLORS.red600,
        defaultTitle: 'Sin Conexión',
        defaultMessage: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
    },
    server: {
        icon: 'server-outline',
        color: COLORS.red600,
        defaultTitle: 'Error del Servidor',
        defaultMessage: 'El servidor no está disponible en este momento. Por favor, intenta más tarde.',
    },
    invalid_link: {
        icon: 'link-outline',
        color: COLORS.orange500,
        defaultTitle: 'Link Inválido',
        defaultMessage: 'El link que intentaste usar no es válido. Asegúrate de copiar el link completo desde el email.',
    },
    unknown: {
        icon: 'alert-circle-outline',
        color: COLORS.gray600,
        defaultTitle: 'Error Desconocido',
        defaultMessage: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
    },
};

export default function ErrorDisplay({
    type,
    title,
    message,
    onRetry,
    onGoBack,
}: ErrorDisplayProps) {
    const config = ERROR_CONFIG[type];

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={config.icon} size={64} color={config.color} />
            </View>

            <Text style={styles.title}>{title || config.defaultTitle}</Text>
            <Text style={styles.message}>{message || config.defaultMessage}</Text>

            {type === 'token_expired' && (
                <View style={styles.suggestionContainer}>
                    <Text style={styles.suggestionTitle}>¿Qué puedes hacer?</Text>
                    <Text style={styles.suggestionText}>
                        • Solicita un nuevo link desde el email original{'\n'}
                        • Contacta al comercio para que te reenvíe la tarjeta{'\n'}
                        • Si tienes acceso al panel, genera un nuevo token
                    </Text>
                </View>
            )}

            {type === 'connection' && (
                <View style={styles.suggestionContainer}>
                    <Text style={styles.suggestionTitle}>Sugerencias:</Text>
                    <Text style={styles.suggestionText}>
                        • Verifica que tengas conexión a internet{'\n'}
                        • Revisa si estás en una red WiFi o datos móviles{'\n'}
                        • Intenta cerrar y abrir la app nuevamente
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    iconContainer: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    message: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: SPACING.lg,
    },
    suggestionContainer: {
        backgroundColor: COLORS.gray50,
        borderRadius: 12,
        padding: SPACING.md,
        marginTop: SPACING.md,
        width: '100%',
        maxWidth: 400,
    },
    suggestionTitle: {
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: TYPOGRAPHY.weights.semibold as any,
        color: COLORS.gray900,
        marginBottom: SPACING.sm,
    },
    suggestionText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray600,
        lineHeight: 20,
    },
});

