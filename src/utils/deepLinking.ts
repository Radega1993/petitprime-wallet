import { Linking } from 'react-native';
import { claimCard } from '../services/walletService';
import { navigate } from './navigationRef';

export interface DeepLinkParams {
    token?: string;
    ticketUrl?: string;
}

/**
 * Parsea un deep link y extrae los parámetros
 * Soporta:
 * - petitprime://claim?token=xxx&ticketUrl=yyy
 * - https://wallet.petitprime.com/claim?token=xxx&ticketUrl=yyy
 * - http://localhost:3000/claim?token=xxx&ticketUrl=yyy (para testing)
 */
export function parseDeepLink(url: string): DeepLinkParams | null {
    try {
        let urlObj: URL;

        // Si la URL no tiene protocolo, agregar uno temporal para parsearla
        if (!url.includes('://')) {
            url = `petitprime://${url}`;
        }

        try {
            urlObj = new URL(url);
        } catch {
            // Si falla, intentar parsear manualmente usando regex
            const match = url.match(/[?&]token=([^&]+)/);
            const ticketMatch = url.match(/[?&]ticketUrl=([^&]+)/);

            if (match) {
                return {
                    token: decodeURIComponent(match[1]),
                    ticketUrl: ticketMatch ? decodeURIComponent(ticketMatch[1]) : undefined,
                };
            }
            return null;
        }

        const params: DeepLinkParams = {};

        // Extraer parámetros de la query string
        urlObj.searchParams.forEach((value, key) => {
            if (key === 'token') {
                params.token = value;
            } else if (key === 'ticketUrl') {
                params.ticketUrl = value;
            }
        });

        return params.token ? params : null;
    } catch (error) {
        console.error('Error parsing deep link:', error);
        return null;
    }
}

/**
 * Maneja un deep link y reclama la tarjeta
 */
export async function handleDeepLink(url: string): Promise<{ success: boolean; error?: string }> {
    try {
        const params = parseDeepLink(url);

        if (!params || !params.token) {
            return { success: false, error: 'Token no encontrado en el link' };
        }

        // Navegar a la pantalla de agregar tarjeta con los parámetros
        navigate('AddCard', params);
        return { success: true };
    } catch (error: any) {
        console.error('Error handling deep link:', error);
        return {
            success: false,
            error: error.message || 'Error al procesar el link'
        };
    }
}

/**
 * Configura el listener de deep links
 */
export function setupDeepLinkListener(
    onDeepLink: (params: DeepLinkParams) => void
): () => void {
    // Manejar deep link inicial si la app se abrió desde un link
    Linking.getInitialURL().then((url) => {
        if (url) {
            const params = parseDeepLink(url);
            if (params) {
                onDeepLink(params);
            }
        }
    });

    // Manejar deep links mientras la app está abierta
    const subscription = Linking.addEventListener('url', (event) => {
        const params = parseDeepLink(event.url);
        if (params) {
            onDeepLink(params);
        }
    });

    // Retornar función para limpiar el listener
    return () => {
        subscription.remove();
    };
}

