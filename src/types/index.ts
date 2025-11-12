// Ticket and Card Types
export interface Marca {
    _id: string;
    nombre: string;
    logotipo?: {
        url: string;
        cdnUrl: string;
    };
    coloresCorporativos?: string[];
    puntosTicket?: number;
    eslogan?: string;
    tipografia?: string;
}

export interface Cliente {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    codigoReferido?: string;
}

export interface Tienda {
    _id: string;
    nombre: string;
    via?: string;
    calle?: string;
    numero?: string;
    poblacion?: string;
    region?: string;
    pais?: string;
}

export interface HistorialConsumicion {
    fecha: string;
    puntos: number;
    tienda: string | Tienda;
    monto: number;
    productos?: Array<{
        nombre: string;
        cantidad: number;
        precio: number;
    }>;
}

export interface HistorialCanjeo {
    fecha: string;
    puntos: number;
    tienda: string | Tienda;
    premio: {
        _id: string;
        nombre: string;
        descripcion?: string;
    };
}

export interface Totales {
    puntosAcumulados: number;
    montoAcumulado: number;
    totalConsumiciones: number;
    totalCanjeos: number;
    ultimaConsumicion?: string;
}

export interface Progreso {
    porcentajeParaSiguientePremio?: number;
    siguientePremioDisponible?: {
        _id: string;
        nombre: string;
        puntosNecesarios: number;
        puntosRestantes: number;
    };
}

export interface Ticket {
    _id: string;
    url: string;
    codigo: string;
    puntos: number;
    acumulado: number;
    canjeos: number;
    total: number;
    tipoFidelizacion: string;
    canjeado: boolean;
    created_at: string;
    cliente: Cliente;
    tienda: Tienda;
    marca: Marca;
    historialConsumiciones: HistorialConsumicion[];
    historialCanjeos: HistorialCanjeo[];
    qrUrl?: string;
    totales: Totales;
    progreso?: Progreso;
}

export interface WalletCard {
    cardId: string;
    ticket: Ticket;
    addedAt: string;
    lastUpdated?: string;
    lastSyncedAt?: string;
    deviceName?: string;
}

export interface LocalCard {
    cardId: string;
    ticketUrl?: string;
    ticketData: Ticket;
    marca?: Marca;
    puntos: number;
    lastSyncedAt: string;
    favorite?: boolean;
    order?: number;
}

export interface ClaimCardRequest {
    token: string;
    deviceId: string;
    deviceName: string;
}

export interface ClaimCardResponse {
    success: boolean;
    data: {
        cardId: string;
        ticket: Ticket;
        addedAt: string;
        message?: string;
    };
}

export interface GetCardsResponse {
    success: boolean;
    data: {
        cards: WalletCard[];
        total: number;
    };
}

export interface GetCardResponse {
    success: boolean;
    data: WalletCard;
}

export interface SyncCardResponse {
    success: boolean;
    data: {
        cardId: string;
        ticket: Ticket;
        lastUpdated: string;
        hasUpdates: boolean;
    };
}

export interface DeleteCardResponse {
    success: boolean;
    message: string;
}

