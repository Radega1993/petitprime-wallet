import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletCard } from '../types';
import { getCardDetail, syncCard, deleteCard } from '../services/walletService';
import { trackCardViewed, trackCardSynced, trackCardDeleted, trackQRDisplayed } from '../services/analyticsService';
import QRCode from '../components/cards/QRCode';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/config';

export default function CardDetailScreen({ route, navigation }: any) {
    const { cardId } = route.params;
    const [card, setCard] = useState<WalletCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        loadCard();
        // Trackear visualización de tarjeta cuando se carga
        if (cardId) {
            trackCardViewed(cardId);
        }
    }, [cardId]);

    const loadCard = async () => {
        try {
            setLoading(true);
            const cardData = await getCardDetail(cardId);
            setCard(cardData);
        } catch (error) {
            console.error('Error loading card:', error);
            Alert.alert('Error', 'No se pudo cargar la tarjeta');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            const updatedCard = await syncCard(cardId);
            setCard(updatedCard);

            // Trackear sincronización
            const hasUpdates = updatedCard.ticket.puntos !== card?.ticket.puntos;
            trackCardSynced(cardId, hasUpdates);

            if (hasUpdates) {
                Alert.alert('Éxito', 'Tarjeta actualizada correctamente');
            } else {
                Alert.alert('Info', 'Tu tarjeta ya está actualizada');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la tarjeta');
        } finally {
            setSyncing(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar tarjeta',
            '¿Estás seguro de que quieres eliminar esta tarjeta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCard(cardId);

                            // Trackear eliminación
                            trackCardDeleted(cardId);

                            Alert.alert('Éxito', 'Tarjeta eliminada');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tarjeta');
                        }
                    },
                },
            ]
        );
    };

    if (loading || !card) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { ticket } = card;
    const { marca, cliente } = ticket;
    const primaryColor = marca.coloresCorporativos?.[0] || COLORS.blue600;
    const secondaryColor = marca.coloresCorporativos?.[1] || COLORS.indigo600;
    const logoUrl = marca.logotipo?.cdnUrl || marca.logotipo?.url;
    const qrValue = ticket.qrUrl || ticket.url;

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView
                style={[
                    styles.scrollView,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Card Header */}
                <LinearGradient
                    colors={[primaryColor, secondaryColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardHeader}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <View style={styles.cardHeaderContent}>
                        {logoUrl ? (
                            <Image source={{ uri: logoUrl }} style={styles.logo} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="storefront" size={32} color={COLORS.white} />
                            </View>
                        )}
                        <Text style={styles.marcaName}>{marca.nombre}</Text>
                        {marca.eslogan && (
                            <Text style={styles.eslogan}>{marca.eslogan}</Text>
                        )}
                    </View>
                </LinearGradient>

                {/* Points Section */}
                <View style={styles.pointsSection}>
                    <Text style={styles.pointsLabel}>Tus Puntos</Text>
                    <Text style={styles.pointsValue}>{ticket.puntos}</Text>
                    {ticket.progreso?.siguientePremioDisponible && (
                        <View style={styles.nextReward}>
                            <Text style={styles.nextRewardText}>
                                {ticket.progreso.siguientePremioDisponible.puntosRestantes} puntos
                                para {ticket.progreso.siguientePremioDisponible.nombre}
                            </Text>
                        </View>
                    )}
                </View>

                {/* QR Code Section */}
                <View style={styles.qrSection}>
                    <Text style={styles.sectionTitle}>Código QR</Text>
                    <View
                        style={styles.qrContainer}
                        onLayout={() => {
                            // Trackear cuando se muestra el QR
                            trackQRDisplayed(cardId);
                        }}
                    >
                        <QRCode value={qrValue} size={250} />
                    </View>
                    <Text style={styles.qrHint}>
                        Muestra este código en la tienda para acumular puntos
                    </Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Estadísticas</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{ticket.totales.totalConsumiciones}</Text>
                            <Text style={styles.statLabel}>Visitas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>€{ticket.totales.montoAcumulado.toFixed(2)}</Text>
                            <Text style={styles.statLabel}>Total gastado</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{ticket.totales.totalCanjeos}</Text>
                            <Text style={styles.statLabel}>Canjes</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsSection}>
                    <Button
                        title="Actualizar puntos"
                        onPress={handleSync}
                        loading={syncing}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Eliminar tarjeta"
                        onPress={handleDelete}
                        variant="danger"
                        style={styles.actionButton}
                    />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray500,
    },
    cardHeader: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING['2xl'],
        paddingHorizontal: SPACING.lg,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: SPACING.md,
    },
    cardHeaderContent: {
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        marginBottom: SPACING.md,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    marcaName: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    eslogan: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.white,
        opacity: 0.9,
    },
    pointsSection: {
        backgroundColor: COLORS.white,
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 16,
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray600,
        marginBottom: SPACING.xs,
    },
    pointsValue: {
        fontSize: TYPOGRAPHY.sizes['4xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
        marginBottom: SPACING.sm,
    },
    nextReward: {
        backgroundColor: COLORS.blue50,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 8,
        marginTop: SPACING.sm,
    },
    nextRewardText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.blue700,
        textAlign: 'center',
    },
    qrSection: {
        backgroundColor: COLORS.white,
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 16,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.semibold as any,
        color: COLORS.gray900,
        marginBottom: SPACING.md,
    },
    qrContainer: {
        marginVertical: SPACING.md,
    },
    qrHint: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray500,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    statsSection: {
        backgroundColor: COLORS.white,
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.blue600,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray600,
    },
    actionsSection: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    actionButton: {
        marginBottom: SPACING.md,
    },
});

