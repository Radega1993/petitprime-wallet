import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
}

export default function EmptyState({
    icon = 'wallet-outline',
    title,
    description,
}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={COLORS.gray300} />
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
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
    title: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.semibold as any,
        color: COLORS.gray900,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    description: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray500,
        marginTop: SPACING.sm,
        textAlign: 'center',
        lineHeight: 22,
    },
});

