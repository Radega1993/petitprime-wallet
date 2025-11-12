import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { LocalCard, Ticket } from '../types';

/**
 * Guarda una tarjeta localmente
 */
export async function saveCardLocally(card: LocalCard): Promise<void> {
    try {
        const cards = await getLocalCards();
        const existingIndex = cards.findIndex(c => c.cardId === card.cardId);

        if (existingIndex >= 0) {
            cards[existingIndex] = card;
        } else {
            cards.push(card);
        }

        await AsyncStorage.setItem(STORAGE_KEYS.WALLET_CARDS, JSON.stringify(cards));
    } catch (error) {
        console.error('Error saving card locally:', error);
        throw error;
    }
}

/**
 * Obtiene todas las tarjetas guardadas localmente
 */
export async function getLocalCards(): Promise<LocalCard[]> {
    try {
        const cardsJson = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_CARDS);
        return cardsJson ? JSON.parse(cardsJson) : [];
    } catch (error) {
        console.error('Error getting local cards:', error);
        return [];
    }
}

/**
 * Actualiza una tarjeta local existente
 */
export async function updateLocalCard(cardId: string, ticketData: any): Promise<void> {
    try {
        const cards = await getLocalCards();
        const cardIndex = cards.findIndex(c => c.cardId === cardId);

        if (cardIndex >= 0) {
            cards[cardIndex] = {
                ...cards[cardIndex],
                ticketData,
                puntos: ticketData.puntos,
                lastSyncedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(STORAGE_KEYS.WALLET_CARDS, JSON.stringify(cards));
        }
    } catch (error) {
        console.error('Error updating local card:', error);
        throw error;
    }
}

/**
 * Elimina una tarjeta local
 */
export async function deleteLocalCard(cardId: string): Promise<void> {
    try {
        const cards = await getLocalCards();
        const filteredCards = cards.filter(c => c.cardId !== cardId);
        await AsyncStorage.setItem(STORAGE_KEYS.WALLET_CARDS, JSON.stringify(filteredCards));
    } catch (error) {
        console.error('Error deleting local card:', error);
        throw error;
    }
}

/**
 * Convierte una WalletCard a LocalCard
 * Preserva el estado de favorito si la tarjeta ya existe localmente
 */
export async function walletCardToLocalCard(walletCard: any): Promise<LocalCard> {
    // Verificar si la tarjeta ya existe localmente para preservar favorite
    const existingCards = await getLocalCards();
    const existingCard = existingCards.find(c => c.cardId === walletCard.cardId);

    return {
        cardId: walletCard.cardId,
        ticketUrl: walletCard.ticket.url,
        ticketData: walletCard.ticket,
        marca: walletCard.ticket.marca,
        puntos: walletCard.ticket.puntos,
        lastSyncedAt: walletCard.lastSyncedAt || walletCard.addedAt,
        favorite: existingCard?.favorite || false, // Preservar favorito si existe
        order: existingCard?.order, // Preservar orden si existe
    };
}

/**
 * Marcar/desmarcar tarjeta como favorita
 */
export async function toggleFavorite(cardId: string): Promise<boolean> {
    try {
        const cards = await getLocalCards();
        const cardIndex = cards.findIndex(card => card.cardId === cardId);

        if (cardIndex === -1) {
            throw new Error('Tarjeta no encontrada');
        }

        const newFavoriteStatus = !cards[cardIndex].favorite;
        cards[cardIndex].favorite = newFavoriteStatus;

        await AsyncStorage.setItem(STORAGE_KEYS.WALLET_CARDS, JSON.stringify(cards));
        return newFavoriteStatus;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
}

/**
 * Obtener solo las tarjetas favoritas
 */
export async function getFavoriteCards(): Promise<LocalCard[]> {
    try {
        const cards = await getLocalCards();
        return cards.filter(card => card.favorite === true);
    } catch (error) {
        console.error('Error getting favorite cards:', error);
        return [];
    }
}

/**
 * Actualizar orden personalizado de tarjetas
 */
export async function updateCardsOrder(cardIds: string[]): Promise<void> {
    try {
        const cards = await getLocalCards();
        const cardMap = new Map(cards.map(card => [card.cardId, card]));

        cardIds.forEach((cardId, index) => {
            const card = cardMap.get(cardId);
            if (card) {
                card.order = index;
            }
        });

        await AsyncStorage.setItem(STORAGE_KEYS.WALLET_CARDS, JSON.stringify(cards));
    } catch (error) {
        console.error('Error updating cards order:', error);
        throw error;
    }
}

