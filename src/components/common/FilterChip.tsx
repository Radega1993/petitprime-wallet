import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export default function FilterChip({
    label,
    selected,
    onPress,
    icon,
}: FilterChipProps) {
    return (
        <TouchableOpacity
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={16}
                    color={selected ? COLORS.white : COLORS.gray600}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.label, selected && styles.labelSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        backgroundColor: COLORS.gray100,
        borderWidth: 1,
        borderColor: COLORS.gray300,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    chipSelected: {
        backgroundColor: COLORS.blue600,
        borderColor: COLORS.blue600,
    },
    label: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.medium as any,
        color: COLORS.gray700,
    },
    labelSelected: {
        color: COLORS.white,
    },
    icon: {
        marginRight: SPACING.xs,
    },
});

