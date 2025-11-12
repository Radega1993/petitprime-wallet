/**
 * Servicio de Analytics para PetitPrime Wallet
 * 
 * Este servicio trackea eventos importantes de la app.
 * Actualmente usa console.log para desarrollo, pero puede ser fácilmente
 * reemplazado por Firebase Analytics, Mixpanel, o cualquier otro servicio.
 */

export type AnalyticsEvent =
    | 'app_opened'
    | 'card_added'
    | 'card_viewed'
    | 'card_deleted'
    | 'card_synced'
    | 'qr_displayed'
    | 'deep_link_opened'
    | 'manual_add_used'
    | 'pull_to_refresh'
    | 'error_occurred'
    | 'card_favorited'
    | 'card_unfavorited'
    | 'view_mode_changed';

export interface AnalyticsProperties {
    [key: string]: string | number | boolean | null | undefined;
}

class AnalyticsService {
    private enabled: boolean = __DEV__ ? true : true; // Siempre habilitado por ahora
    private events: Array<{ event: AnalyticsEvent; properties: AnalyticsProperties; timestamp: Date }> = [];

    /**
     * Trackea un evento
     */
    track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
        if (!this.enabled) return;

        const eventData = {
            event,
            properties: properties || {},
            timestamp: new Date(),
        };

        // Guardar en memoria (para desarrollo/debugging)
        this.events.push(eventData);

        // Limitar el tamaño del array para no consumir mucha memoria
        if (this.events.length > 100) {
            this.events.shift();
        }

        // Log en desarrollo
        if (__DEV__) {
            console.log(`[Analytics] ${event}`, properties || {});
        }

        // Aquí puedes agregar integración con Firebase Analytics, Mixpanel, etc.
        // Ejemplo:
        // if (firebaseAnalytics) {
        //   firebaseAnalytics.logEvent(event, properties);
        // }
    }

    /**
     * Trackea la apertura de la app
     */
    trackAppOpened(): void {
        this.track('app_opened', {
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se agrega una tarjeta
     */
    trackCardAdded(cardId: string, method: 'deep_link' | 'manual'): void {
        this.track('card_added', {
            cardId,
            method,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se visualiza una tarjeta
     */
    trackCardViewed(cardId: string): void {
        this.track('card_viewed', {
            cardId,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se elimina una tarjeta
     */
    trackCardDeleted(cardId: string): void {
        this.track('card_deleted', {
            cardId,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se sincroniza una tarjeta
     */
    trackCardSynced(cardId: string, hasUpdates: boolean): void {
        this.track('card_synced', {
            cardId,
            hasUpdates,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se muestra el QR
     */
    trackQRDisplayed(cardId: string): void {
        this.track('qr_displayed', {
            cardId,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se abre un deep link
     */
    trackDeepLinkOpened(source: 'email' | 'manual'): void {
        this.track('deep_link_opened', {
            source,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea cuando se usa agregar manual
     */
    trackManualAddUsed(): void {
        this.track('manual_add_used', {
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea pull to refresh
     */
    trackPullToRefresh(cardCount: number): void {
        this.track('pull_to_refresh', {
            cardCount,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Trackea errores
     */
    trackError(errorType: string, errorMessage: string, context?: string): void {
        this.track('error_occurred', {
            errorType,
            errorMessage,
            context: context || 'unknown',
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Obtiene todos los eventos trackeados (útil para debugging)
     */
    getEvents(): Array<{ event: AnalyticsEvent; properties: AnalyticsProperties; timestamp: Date }> {
        return [...this.events];
    }

    /**
     * Limpia los eventos (útil para testing)
     */
    clearEvents(): void {
        this.events = [];
    }

    /**
     * Habilita o deshabilita el tracking
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
}

// Exportar instancia singleton
export const analytics = new AnalyticsService();

// Exportar funciones de conveniencia
export const trackEvent = (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
    analytics.track(event, properties);
};

export const trackAppOpened = () => analytics.trackAppOpened();
export const trackCardAdded = (cardId: string, method: 'deep_link' | 'manual') =>
    analytics.trackCardAdded(cardId, method);
export const trackCardViewed = (cardId: string) => analytics.trackCardViewed(cardId);
export const trackCardDeleted = (cardId: string) => analytics.trackCardDeleted(cardId);
export const trackCardSynced = (cardId: string, hasUpdates: boolean) =>
    analytics.trackCardSynced(cardId, hasUpdates);
export const trackQRDisplayed = (cardId: string) => analytics.trackQRDisplayed(cardId);
export const trackDeepLinkOpened = (source: 'email' | 'manual') =>
    analytics.trackDeepLinkOpened(source);
export const trackManualAddUsed = () => analytics.trackManualAddUsed();
export const trackPullToRefresh = (cardCount: number) =>
    analytics.trackPullToRefresh(cardCount);
export const trackError = (errorType: string, errorMessage: string, context?: string) =>
    analytics.trackError(errorType, errorMessage, context);

