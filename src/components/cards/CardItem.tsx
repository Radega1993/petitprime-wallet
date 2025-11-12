import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard } from '../../types';
import { toggleFavorite } from '../../utils/storage';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

interface CardItemProps {
    card: WalletCard;
    onPress: () => void;
    onFavoriteChange?: (cardId: string, isFavorite: boolean) => void;
}

export default function CardItem({ card, onPress, onFavoriteChange }: CardItemProps) {
    const { ticket } = card;
    const puntos = card.ticket.puntos;
    const { marca } = ticket;

    // Colores de la marca o por defecto
    const primaryColor = marca.coloresCorporativos?.[0] || COLORS.blue600;
    const secondaryColor = marca.coloresCorporativos?.[1] || COLORS.indigo600;
    const logoUrl = marca.logotipo?.cdnUrl || marca.logotipo?.url;

    // Estado de favorito (obtener del storage local)
    const [isFavorite, setIsFavorite] = useState(false);

    // Animaciones
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const favoriteScaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Cargar estado de favorito desde storage local
        const loadFavoriteStatus = async () => {
            try {
                const { getLocalCards } = await import('../../utils/storage');
                const localCards = await getLocalCards();
                const localCard = localCards.find(lc => lc.cardId === card.cardId);
                setIsFavorite(localCard?.favorite || false);
            } catch (error) {
                console.error('Error loading favorite status:', error);
            }
        };
        loadFavoriteStatus();

        // Animación de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [card.cardId]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleFavoritePress = async (e: any) => {
        e.stopPropagation(); // Evitar que se active el onPress del card

        try {
            const newFavoriteStatus = await toggleFavorite(card.cardId);
            setIsFavorite(newFavoriteStatus);

            // Animación del botón de favorito
            Animated.sequence([
                Animated.spring(favoriteScaleAnim, {
                    toValue: 1.3,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.spring(favoriteScaleAnim, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();

            // Trackear evento
            const { trackEvent } = await import('../../services/analyticsService');
            trackEvent(newFavoriteStatus ? 'card_favorited' : 'card_unfavorited', {
                cardId: card.cardId,
            });

            // Notificar cambio de favorito al padre
            if (onFavoriteChange) {
                onFavoriteChange(card.cardId, newFavoriteStatus);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <LinearGradient
                    colors={[primaryColor, secondaryColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    {/* Botón de favorito */}
                    <TouchableOpacity
                        onPress={handleFavoritePress}
                        style={styles.favoriteButton}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={{ transform: [{ scale: favoriteScaleAnim }] }}>
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavorite ? COLORS.red500 : COLORS.white}
                                style={styles.favoriteIcon}
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        {logoUrl ? (
                            <Image source={{ uri: logoUrl }} style={styles.logo} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="storefront" size={24} color={COLORS.white} />
                            </View>
                        )}
                        <View style={styles.headerText}>
                            <Text style={styles.marcaName} numberOfLines={1}>
                                {marca.nombre}
                            </Text>
                            {marca.eslogan && (
                                <Text style={styles.eslogan} numberOfLines={1}>
                                    {marca.eslogan}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.pointsContainer}>
                        <Text style={styles.pointsLabel}>Puntos</Text>
                        <Text style={styles.pointsValue}>{puntos || ticket.puntos}</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.clientName}>
                            {ticket.cliente.nombre} {ticket.cliente.apellido}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    card: {
        borderRadius: 16,
        padding: SPACING.lg,
        minHeight: 180,
        justifyContent: 'space-between',
        position: 'relative',
    },
    favoriteButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        zIndex: 10,
        padding: SPACING.xs,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    favoriteIcon: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        marginRight: SPACING.sm,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    headerText: {
        flex: 1,
    },
    marcaName: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.white,
    },
    eslogan: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.white,
        opacity: 0.9,
        marginTop: 2,
    },
    pointsContainer: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    pointsLabel: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    pointsValue: {
        fontSize: TYPOGRAPHY.sizes['4xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    clientName: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.white,
        fontWeight: TYPOGRAPHY.weights.medium as any,
    },
});

