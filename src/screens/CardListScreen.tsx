import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WalletCard } from '../types';
import { getWalletCards, syncAllCards } from '../services/walletService';
import CardItem from '../components/cards/CardItem';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function CardListScreen({ navigation }: any) {
    const [cards, setCards] = useState<WalletCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadCards = async () => {
        try {
            const walletCards = await getWalletCards();
            setCards(walletCards);
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await syncAllCards();
            await loadCards();
        } catch (error) {
            console.error('Error refreshing:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Cargar tarjetas cuando la pantalla está enfocada
    useFocusEffect(
        useCallback(() => {
            loadCards();
        }, [])
    );

    // Sincronizar automáticamente al abrir la app
    useEffect(() => {
        const syncAndLoad = async () => {
            try {
                await syncAllCards();
                await loadCards();
            } catch (error) {
                console.error('Error syncing on mount:', error);
                // Cargar desde caché local si falla la sincronización
                loadCards();
            }
        };

        syncAndLoad();
    }, []);

    const handleCardPress = (card: WalletCard) => {
        navigation.navigate('CardDetail', { cardId: card.cardId });
    };

    if (loading && cards.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mis Tarjetas</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Tarjetas</Text>
                <Button
                    title=""
                    onPress={() => navigation.navigate('AddCardManual')}
                    variant="secondary"
                    style={styles.addButton}
                >
                    <Ionicons name="add" size={24} color={COLORS.blue600} />
                </Button>
            </View>

            {cards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <EmptyState
                        icon="wallet-outline"
                        title="No tienes tarjetas aún"
                        description="Agrega tu primera tarjeta desde el email que recibiste o usando el botón de arriba"
                    />
                    <View style={styles.emptyButtonContainer}>
                        <Button
                            title="Agregar Tarjeta Manualmente"
                            onPress={() => navigation.navigate('AddCardManual')}
                            style={styles.emptyAddButton}
                        />
                    </View>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    renderItem={({ item }) => (
                        <CardItem card={item} onPress={() => handleCardPress(item)} />
                    )}
                    keyExtractor={(item) => item.cardId}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.blue600]}
                            tintColor={COLORS.blue600}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
        flex: 1,
    },
    addButton: {
        width: 40,
        height: 40,
        padding: 0,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
    },
    emptyButtonContainer: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    emptyAddButton: {
        marginTop: SPACING.md,
    },
    listContent: {
        padding: SPACING.md,
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
});

