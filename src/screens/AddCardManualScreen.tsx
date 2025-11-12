import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import * as ClipboardModule from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { claimCard } from '../services/walletService';
import { parseDeepLink } from '../utils/deepLinking';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/config';

interface AddCardManualScreenProps {
    navigation: any;
}

export default function AddCardManualScreen({ navigation }: AddCardManualScreenProps) {
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddCard = async () => {
        if (!link.trim()) {
            Alert.alert('Error', 'Por favor ingresa un link válido');
            return;
        }

        try {
            setLoading(true);

            // Parsear el link para extraer el token
            const params = parseDeepLink(link.trim());

            if (!params || !params.token) {
                Alert.alert(
                    'Link inválido',
                    'El link no contiene un token válido. Asegúrate de copiar el link completo (deepLink o universalLink).'
                );
                return;
            }

            // Reclamar la tarjeta
            await claimCard(params.token, params.ticketUrl);

            Alert.alert(
                '¡Tarjeta agregada!',
                'Tu tarjeta se ha agregado correctamente a tu wallet.',
                [
                    {
                        text: 'Ver mis tarjetas',
                        onPress: () => {
                            navigation.navigate('CardList');
                        },
                    },
                ]
            );
        } catch (err: any) {
            console.error('Error claiming card:', err);
            Alert.alert(
                'Error',
                err.message || 'No se pudo agregar la tarjeta. El token puede haber expirado o ya haber sido usado.',
                [{ text: 'Aceptar' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = async () => {
        try {
            // Intentar pegar desde el portapapeles
            const clipboardText = await ClipboardModule.getStringAsync();
            if (clipboardText) {
                // Verificar si parece un link válido (incluye localhost para testing)
                const isValidLink =
                    clipboardText.includes('petitprime://') ||
                    clipboardText.includes('wallet.petitprime.com') ||
                    clipboardText.includes('localhost') ||
                    clipboardText.includes('192.168.') ||
                    clipboardText.includes('127.0.0.1');

                if (isValidLink && clipboardText.includes('token=')) {
                    setLink(clipboardText);
                    Alert.alert('Link pegado', 'El link se ha pegado correctamente. Verifica que sea correcto antes de agregar.');
                } else {
                    Alert.alert(
                        'Link no válido',
                        'El texto en el portapapeles no parece ser un link válido de PetitPrime. Asegúrate de copiar el link completo con el parámetro token.'
                    );
                }
            } else {
                Alert.alert(
                    'Portapapeles vacío',
                    'No hay texto en el portapapeles. Copia el link primero y luego presiona "Pegar".'
                );
            }
        } catch (error) {
            console.error('Error al pegar:', error);
            Alert.alert(
                'Error',
                'No se pudo acceder al portapapeles. Puedes pegar manualmente manteniendo presionado el campo de texto.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Button
                            title=""
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
                        </Button>
                        <Text style={styles.title}>Agregar Tarjeta</Text>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="link" size={64} color={COLORS.blue600} />
                        </View>

                        <Text style={styles.description}>
                            Pega aquí el link de tu tarjeta (deepLink o universalLink) que recibiste por email
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="petitprime://claim?token=... o https://wallet.petitprime.com/claim?token=..."
                                placeholderTextColor={COLORS.gray400}
                                value={link}
                                onChangeText={setLink}
                                multiline
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="URL"
                            />
                            <Button
                                title="Pegar"
                                onPress={handlePaste}
                                variant="secondary"
                                style={styles.pasteButton}
                            />
                        </View>

                        <View style={styles.hintContainer}>
                            <Ionicons name="information-circle" size={20} color={COLORS.blue600} />
                            <Text style={styles.hintText}>
                                Puedes copiar el link desde el email o desde el panel de administración
                            </Text>
                        </View>

                        <Button
                            title="Agregar Tarjeta"
                            onPress={handleAddCard}
                            loading={loading}
                            disabled={!link.trim() || loading}
                            style={styles.addButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    backButton: {
        width: 40,
        height: 40,
        padding: 0,
        marginRight: SPACING.md,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    description: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray300,
        borderRadius: 12,
        padding: SPACING.md,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray900,
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: SPACING.sm,
    },
    pasteButton: {
        alignSelf: 'flex-end',
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.blue50,
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.xl,
    },
    hintText: {
        flex: 1,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.blue700,
        marginLeft: SPACING.sm,
        lineHeight: 20,
    },
    addButton: {
        marginTop: 'auto',
    },
});

