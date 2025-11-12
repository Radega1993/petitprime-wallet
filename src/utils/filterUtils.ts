import { WalletCard } from '../types';

export type SortOption = 'name_asc' | 'name_desc' | 'points_asc' | 'points_desc' | 'date_asc' | 'date_desc';
export type FilterOption = {
    comercio?: string;
    minPoints?: number;
    maxPoints?: number;
    favoritesOnly?: boolean;
};

/**
 * Filtra tarjetas por texto de búsqueda
 */
export function filterCardsBySearch(cards: WalletCard[], searchText: string): WalletCard[] {
    if (!searchText.trim()) {
        return cards;
    }

    const searchLower = searchText.toLowerCase().trim();

    return cards.filter((card) => {
        const marcaNombre = card.ticket.marca.nombre.toLowerCase();
        const clienteNombre = `${card.ticket.cliente.nombre} ${card.ticket.cliente.apellido}`.toLowerCase();
        const eslogan = card.ticket.marca.eslogan?.toLowerCase() || '';

        return (
            marcaNombre.includes(searchLower) ||
            clienteNombre.includes(searchLower) ||
            eslogan.includes(searchLower)
        );
    });
}

/**
 * Filtra tarjetas por opciones de filtro
 */
export function filterCardsByOptions(cards: WalletCard[], filters: FilterOption): WalletCard[] {
    let filtered = [...cards];

    // Filtrar por comercio
    if (filters.comercio) {
        filtered = filtered.filter(
            (card) => card.ticket.marca.nombre === filters.comercio
        );
    }

    // Filtrar por puntos mínimos
    if (filters.minPoints !== undefined) {
        filtered = filtered.filter(
            (card) => (card.ticket.puntos || 0) >= filters.minPoints!
        );
    }

    // Filtrar por puntos máximos
    if (filters.maxPoints !== undefined) {
        filtered = filtered.filter(
            (card) => (card.ticket.puntos || 0) <= filters.maxPoints!
        );
    }

    return filtered;
}

/**
 * Ordena tarjetas según la opción seleccionada
 */
export function sortCards(cards: WalletCard[], sortOption: SortOption): WalletCard[] {
    const sorted = [...cards];

    switch (sortOption) {
        case 'name_asc':
            return sorted.sort((a, b) =>
                a.ticket.marca.nombre.localeCompare(b.ticket.marca.nombre)
            );

        case 'name_desc':
            return sorted.sort((a, b) =>
                b.ticket.marca.nombre.localeCompare(a.ticket.marca.nombre)
            );

        case 'points_asc':
            return sorted.sort(
                (a, b) => (a.ticket.puntos || 0) - (b.ticket.puntos || 0)
            );

        case 'points_desc':
            return sorted.sort(
                (a, b) => (b.ticket.puntos || 0) - (a.ticket.puntos || 0)
            );

        case 'date_asc':
            // Ordenar por fecha de creación (más antigua primero)
            // Nota: Necesitarías agregar un campo createdAt a WalletCard
            return sorted;

        case 'date_desc':
            // Ordenar por fecha de creación (más reciente primero)
            return sorted;

        default:
            return sorted;
    }
}

/**
 * Obtiene lista única de comercios de las tarjetas
 */
export function getUniqueComercios(cards: WalletCard[]): string[] {
    const comercios = new Set<string>();
    cards.forEach((card) => {
        comercios.add(card.ticket.marca.nombre);
    });
    return Array.from(comercios).sort();
}

/**
 * Aplica todos los filtros y ordenamiento
 */
export function applyFiltersAndSort(
    cards: WalletCard[],
    searchText: string,
    filters: FilterOption,
    sortOption: SortOption
): WalletCard[] {
    let result = [...cards];

    // Aplicar búsqueda
    result = filterCardsBySearch(result, searchText);

    // Aplicar filtros
    result = filterCardsByOptions(result, filters);

    // Aplicar ordenamiento
    result = sortCards(result, sortOption);

    return result;
}

