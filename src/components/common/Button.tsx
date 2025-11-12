import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY } from '../../constants/config';

interface ButtonProps {
    title?: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    children,
}: ButtonProps) {
    const isGradient = variant === 'primary';
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (!disabled && !loading) {
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (!disabled && !loading) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    };

    const buttonContent = (
        <>
            {loading ? (
                <ActivityIndicator color={isGradient ? COLORS.white : COLORS.gray700} />
            ) : children ? (
                children
            ) : (
                <Text style={[styles.text, styles[variant], textStyle]}>{title}</Text>
            )}
        </>
    );

    if (isGradient && !disabled) {
        return (
            <Animated.View
                style={[
                    styles.container,
                    style,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <TouchableOpacity
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={1}
                >
                    <LinearGradient
                        colors={[COLORS.blue600, COLORS.indigo600]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }] },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={[
                    styles.container,
                    styles[variant],
                    disabled && styles.disabled,
                    style,
                ]}
                activeOpacity={0.7}
            >
                {buttonContent}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    gradient: {
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    text: {
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: TYPOGRAPHY.weights.bold as any,
    },
    primary: {
        color: COLORS.white,
    },
    secondary: {
        backgroundColor: COLORS.gray100,
        borderWidth: 1,
        borderColor: COLORS.gray300,
    },
    danger: {
        backgroundColor: COLORS.red600,
    },
    success: {
        backgroundColor: COLORS.green600,
    },
    disabled: {
        backgroundColor: COLORS.gray400,
        opacity: 0.6,
    },
});

