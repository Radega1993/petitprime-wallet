import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Buscar tarjetas...',
    onClear,
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray500} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray400}
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        height: 44,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray900,
        padding: 0,
    },
    clearButton: {
        marginLeft: SPACING.sm,
        padding: SPACING.xs,
    },
});

