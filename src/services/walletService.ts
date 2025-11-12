import { API_BASE_URL } from '../constants/config';
import { getOrCreateDeviceId, getDeviceName } from '../utils/device';
import { saveCardLocally, updateLocalCard, deleteLocalCard, walletCardToLocalCard } from '../utils/storage';
import {
    ClaimCardRequest,
    ClaimCardResponse,
    GetCardsResponse,
    GetCardResponse,
    SyncCardResponse,
    DeleteCardResponse,
    WalletCard,
} from '../types';

/**
 * Reclama una tarjeta usando un token de un solo uso
 */
export async function claimCard(token: string, ticketUrl?: string): Promise<ClaimCardResponse['data']> {
    try {
        const deviceId = await getOrCreateDeviceId();
        const deviceName = await getDeviceName();

        const requestBody: ClaimCardRequest = {
            token,
            deviceId,
            deviceName,
        };

        const response = await fetch(`${API_BASE_URL}/wallet/claim`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            let errorMessage = 'Error al reclamar tarjeta';
            let errorData: any = {};

            try {
                errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // Si no se puede parsear el error, usar el status text
                errorMessage = response.statusText || `Error ${response.status}`;
            }

            // Crear error con información adicional
            const error = new Error(errorMessage);
            (error as any).status = response.status;
            (error as any).statusText = response.statusText;
            (error as any).data = errorData;
            throw error;
        }

        const data: ClaimCardResponse = await response.json();

        // Guardar tarjeta localmente
        const localCard = await walletCardToLocalCard(data.data);
        await saveCardLocally(localCard);

        return data.data;
    } catch (error: any) {
        console.error('Error claiming card:', error);
        // Mejorar mensaje de error para conexión
        if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo y la URL sea correcta.');
        }
        throw error;
    }
}

/**
 * Obtiene todas las tarjetas del dispositivo
 */
export async function getWalletCards(): Promise<WalletCard[]> {
    try {
        const deviceId = await getOrCreateDeviceId();

        const response = await fetch(
            `${API_BASE_URL}/wallet/cards?deviceId=${deviceId}`
        );

        if (!response.ok) {
            throw new Error('Error al obtener tarjetas');
        }

        const data: GetCardsResponse = await response.json();

        // Actualizar caché local
        for (const card of data.data.cards) {
            const localCard = await walletCardToLocalCard(card);
            await saveCardLocally(localCard);
        }

        return data.data.cards;
    } catch (error: any) {
        console.error('Error getting wallet cards:', error);
        // Fallback a caché local si hay error de red
        const { getLocalCards } = await import('../utils/storage');
        const localCards = await getLocalCards();
        // Convertir LocalCard a WalletCard para compatibilidad
        return localCards.map(card => ({
            cardId: card.cardId,
            ticket: card.ticketData,
            addedAt: card.lastSyncedAt,
            lastSyncedAt: card.lastSyncedAt,
            deviceName: undefined,
        }));
    }
}

/**
 * Obtiene el detalle de una tarjeta específica
 */
export async function getCardDetail(cardId: string): Promise<WalletCard> {
    try {
        const deviceId = await getOrCreateDeviceId();

        const response = await fetch(
            `${API_BASE_URL}/wallet/cards/${cardId}?deviceId=${deviceId}`
        );

        if (!response.ok) {
            throw new Error('Error al obtener detalle de tarjeta');
        }

        const data: GetCardResponse = await response.json();

        // Actualizar tarjeta local
        const localCard = await walletCardToLocalCard(data.data);
        await saveCardLocally(localCard);

        return data.data;
    } catch (error) {
        console.error('Error getting card detail:', error);
        throw error;
    }
}

/**
 * Sincroniza una tarjeta con el servidor (actualiza puntos)
 */
export async function syncCard(cardId: string): Promise<SyncCardResponse['data']> {
    try {
        const deviceId = await getOrCreateDeviceId();

        const response = await fetch(
            `${API_BASE_URL}/wallet/cards/${cardId}/sync?deviceId=${deviceId}`
        );

        if (!response.ok) {
            throw new Error('Error al sincronizar tarjeta');
        }

        const data: SyncCardResponse = await response.json();

        // Actualizar tarjeta local
        await updateLocalCard(cardId, data.data.ticket);

        return data.data;
    } catch (error) {
        console.error('Error syncing card:', error);
        throw error;
    }
}

/**
 * Elimina una tarjeta del dispositivo
 */
export async function deleteCard(cardId: string): Promise<void> {
    try {
        const deviceId = await getOrCreateDeviceId();

        const response = await fetch(
            `${API_BASE_URL}/wallet/cards/${cardId}?deviceId=${deviceId}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Error al eliminar tarjeta');
        }

        // Eliminar de almacenamiento local
        await deleteLocalCard(cardId);
    } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
    }
}

/**
 * Sincroniza todas las tarjetas del dispositivo
 */
export async function syncAllCards(): Promise<void> {
    try {
        const cards = await getWalletCards();

        for (const card of cards) {
            try {
                await syncCard(card.cardId);
            } catch (error) {
                console.error(`Error syncing card ${card.cardId}:`, error);
                // Continuar con las demás tarjetas aunque una falle
            }
        }
    } catch (error) {
        console.error('Error syncing all cards:', error);
        throw error;
    }
}

