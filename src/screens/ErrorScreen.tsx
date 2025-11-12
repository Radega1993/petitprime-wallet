import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ErrorDisplay, { ErrorType } from '../components/common/ErrorDisplay';
import Button from '../components/common/Button';
import { COLORS, SPACING } from '../constants/config';

interface ErrorScreenProps {
    route: {
        params: {
            type: ErrorType;
            title?: string;
            message?: string;
            error?: any;
        };
    };
    navigation: any;
}

export default function ErrorScreen({ route, navigation }: ErrorScreenProps) {
    const { type, title, message, error } = route.params || {};

    // Determinar tipo de error si viene del objeto error
    let errorType: ErrorType = type || 'unknown';
    let errorTitle = title;
    let errorMessage = message;

    if (error) {
        const errorStr = error.message || error.toString() || '';

        if (errorStr.includes('expirado') || errorStr.includes('expired')) {
            errorType = 'token_expired';
        } else if (errorStr.includes('ya usado') || errorStr.includes('already used')) {
            errorType = 'token_used';
        } else if (
            errorStr.includes('conexión') ||
            errorStr.includes('connection') ||
            errorStr.includes('Network request failed') ||
            errorStr.includes('Failed to fetch')
        ) {
            errorType = 'connection';
        } else if (errorStr.includes('servidor') || errorStr.includes('server')) {
            errorType = 'server';
        } else if (errorStr.includes('inválido') || errorStr.includes('invalid')) {
            errorType = 'invalid_link';
        }

        if (!errorTitle) {
            errorTitle = undefined; // Usará el default del ErrorDisplay
        }
        if (!errorMessage) {
            errorMessage = errorStr;
        }
    }

    const handleRetry = () => {
        // Volver a la pantalla anterior y permitir reintentar
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('CardList');
        }
    };

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('CardList');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ErrorDisplay
                    type={errorType}
                    title={errorTitle}
                    message={errorMessage}
                    onRetry={handleRetry}
                    onGoBack={handleGoBack}
                />

                <View style={styles.actions}>
                    {errorType === 'connection' && (
                        <Button
                            title="Reintentar"
                            onPress={handleRetry}
                            style={styles.button}
                        />
                    )}
                    <Button
                        title="Volver"
                        onPress={handleGoBack}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
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
        justifyContent: 'center',
    },
    actions: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    button: {
        marginBottom: SPACING.md,
    },
});

