import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard } from '../../types';
import CardItem from './CardItem';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 80; // Ancho de la tarjeta con márgenes
const CARD_SPACING = 20;

interface CarouselViewProps {
    cards: WalletCard[];
    onCardPress: (card: WalletCard) => void;
    onFavoriteChange?: (cardId: string, isFavorite: boolean) => void;
}

export default function CarouselView({ cards, onCardPress, onFavoriteChange }: CarouselViewProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
                setCurrentIndex(index);
            },
        }
    );

    const scrollToIndex = (index: number) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: index * (CARD_WIDTH + CARD_SPACING),
                animated: true,
            });
        }
    };

    if (cards.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="images-outline" size={64} color={COLORS.gray400} />
                <Text style={styles.emptyText}>No hay tarjetas para mostrar</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {cards.map((card, index) => (
                    <View
                        key={card.cardId}
                        style={[
                            styles.cardWrapper,
                            { width: CARD_WIDTH },
                        ]}
                    >
                        <CardItem
                            card={card}
                            onPress={() => onCardPress(card)}
                            onFavoriteChange={onFavoriteChange}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Indicadores de página */}
            {cards.length > 1 && (
                <View style={styles.indicatorsContainer}>
                    {cards.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.indicatorActive,
                            ]}
                            onPress={() => scrollToIndex(index)}
                        />
                    ))}
                </View>
            )}

            {/* Contador de tarjetas */}
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                    {currentIndex + 1} / {cards.length}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: SPACING.lg,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
    },
    cardWrapper: {
        marginRight: CARD_SPACING,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        marginTop: SPACING.md,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray500,
    },
    indicatorsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.xs,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.gray300,
        marginHorizontal: 4,
    },
    indicatorActive: {
        width: 24,
        backgroundColor: COLORS.blue600,
    },
    counterContainer: {
        alignItems: 'center',
        paddingBottom: SPACING.sm,
    },
    counterText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray600,
        fontWeight: TYPOGRAPHY.weights.medium as any,
    },
});

