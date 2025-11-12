import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Animated,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WalletCard } from '../types';
import { getWalletCards, syncAllCards } from '../services/walletService';
import { trackPullToRefresh } from '../services/analyticsService';
import CardItem from '../components/cards/CardItem';
import CarouselView from '../components/cards/CarouselView';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import SearchBar from '../components/common/SearchBar';
import AnalyticsDebug from '../components/debug/AnalyticsDebug';
import {
    applyFiltersAndSort,
    getUniqueComercios,
    SortOption,
    FilterOption,
} from '../utils/filterUtils';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function CardListScreen({ navigation }: any) {
    const [cards, setCards] = useState<WalletCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Estados de búsqueda y filtros
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<FilterOption>({});
    const [sortOption, setSortOption] = useState<SortOption>('name_asc');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'carousel'>('list');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Obtener comercios únicos
    const comercios = useMemo(() => getUniqueComercios(cards), [cards]);

    // Estado para favoritos
    const [favoriteCardIds, setFavoriteCardIds] = useState<Set<string>>(new Set());

    // Cargar favoritos al cargar tarjetas
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const { getLocalCards } = await import('../utils/storage');
                const localCards = await getLocalCards();
                const favorites = new Set(
                    localCards.filter(card => card.favorite).map(card => card.cardId)
                );
                setFavoriteCardIds(favorites);
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        if (cards.length > 0) {
            loadFavorites();
        }
    }, [cards]);

    // Aplicar filtros, favoritos y ordenamiento
    const filteredCards = useMemo(() => {
        let result = applyFiltersAndSort(cards, searchText, filters, sortOption);

        // Filtrar por favoritos si está activo
        if (showFavoritesOnly) {
            result = result.filter(card => favoriteCardIds.has(card.cardId));
        }

        return result;
    }, [cards, searchText, filters, sortOption, showFavoritesOnly, favoriteCardIds]);

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
            // Trackear pull to refresh
            trackPullToRefresh(cards.length);
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
        // Trackear visualización de tarjeta
        const { trackCardViewed } = require('../services/analyticsService');
        trackCardViewed(card.cardId);
        navigation.navigate('CardDetail', { cardId: card.cardId });
    };

    const handleClearSearch = () => {
        setSearchText('');
    };

    const handleFilterComercio = (comercio: string | undefined) => {
        setFilters((prev) => ({
            ...prev,
            comercio: prev.comercio === comercio ? undefined : comercio,
        }));
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setShowFilters(false);
    };

    const handleViewModeChange = (mode: 'list' | 'carousel') => {
        setViewMode(mode);
        const { trackEvent } = require('../services/analyticsService');
        trackEvent('view_mode_changed', { mode });
    };

    const handleFavoriteToggle = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    const handleFavoriteChange = (cardId: string, isFavorite: boolean) => {
        setFavoriteCardIds(prev => {
            const newSet = new Set(prev);
            if (isFavorite) {
                newSet.add(cardId);
            } else {
                newSet.delete(cardId);
            }
            return newSet;
        });
    };

    const clearFilters = () => {
        setFilters({});
        setSearchText('');
    };

    const hasActiveFilters = searchText.length > 0 || Object.keys(filters).length > 0;

    if (loading && cards.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mis Tarjetas</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <SkeletonLoader width="90%" height={180} borderRadius={16} style={styles.skeletonCard} />
                    <SkeletonLoader width="90%" height={180} borderRadius={16} style={styles.skeletonCard} />
                    <SkeletonLoader width="90%" height={180} borderRadius={16} style={styles.skeletonCard} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Tarjetas</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={handleFavoriteToggle}
                        style={styles.favoriteFilterButton}
                    >
                        <Ionicons
                            name={showFavoritesOnly ? 'heart' : 'heart-outline'}
                            size={24}
                            color={showFavoritesOnly ? COLORS.red500 : COLORS.blue600}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleViewModeChange(viewMode === 'list' ? 'carousel' : 'list')}
                        style={styles.viewModeButton}
                    >
                        <Ionicons
                            name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
                            size={24}
                            color={COLORS.blue600}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowFilters(true)}
                        style={styles.filterButton}
                    >
                        <Ionicons name="options-outline" size={24} color={COLORS.blue600} />
                        {hasActiveFilters && <View style={styles.filterBadge} />}
                    </TouchableOpacity>
                    <Button
                        title=""
                        onPress={() => navigation.navigate('AddCardManual')}
                        variant="secondary"
                        style={styles.addButton}
                    >
                        <Ionicons name="add" size={24} color={COLORS.blue600} />
                    </Button>
                </View>
            </View>

            {cards.length > 0 && (
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Buscar por comercio o nombre..."
                    onClear={handleClearSearch}
                />
            )}

            {hasActiveFilters && (
                <View style={styles.activeFiltersContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                        {filters.comercio && (
                            <View style={styles.activeFilter}>
                                <Text style={styles.activeFilterText}>{filters.comercio}</Text>
                                <TouchableOpacity
                                    onPress={() => handleFilterComercio(filters.comercio)}
                                    style={styles.removeFilterButton}
                                >
                                    <Ionicons name="close" size={16} color={COLORS.gray600} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity onPress={clearFilters} style={styles.clearAllButton}>
                            <Text style={styles.clearAllText}>Limpiar todo</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}

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
            ) : filteredCards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <EmptyState
                        icon={showFavoritesOnly ? "heart-outline" : "search-outline"}
                        title={showFavoritesOnly ? "No tienes favoritos" : "No se encontraron tarjetas"}
                        description={showFavoritesOnly ? "Marca algunas tarjetas como favoritas para verlas aquí" : "Intenta ajustar tus filtros de búsqueda"}
                    />
                    {hasActiveFilters && (
                        <Button
                            title="Limpiar Filtros"
                            onPress={clearFilters}
                            style={styles.clearFiltersButton}
                        />
                    )}
                </View>
            ) : viewMode === 'carousel' ? (
                <View style={styles.carouselContainer}>
                    <CarouselView
                        cards={filteredCards}
                        onCardPress={handleCardPress}
                        onFavoriteChange={handleFavoriteChange}
                    />
                    {filteredCards.length !== cards.length && (
                        <Text style={styles.resultsText}>
                            {filteredCards.length} de {cards.length} tarjetas
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredCards}
                    renderItem={({ item }) => (
                        <CardItem
                            card={item}
                            onPress={() => handleCardPress(item)}
                            onFavoriteChange={handleFavoriteChange}
                        />
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
                    ListHeaderComponent={
                        filteredCards.length !== cards.length ? (
                            <Text style={styles.resultsText}>
                                {filteredCards.length} de {cards.length} tarjetas
                            </Text>
                        ) : null
                    }
                />
            )}

            {/* Modal de Filtros */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros y Ordenamiento</Text>
                            <TouchableOpacity
                                onPress={() => setShowFilters(false)}
                                style={styles.modalCloseButton}
                            >
                                <Ionicons name="close" size={24} color={COLORS.gray700} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Ordenamiento */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                                <TouchableOpacity
                                    style={[styles.sortOption, sortOption === 'name_asc' && styles.sortOptionSelected]}
                                    onPress={() => handleSortChange('name_asc')}
                                >
                                    <Text style={[styles.sortOptionText, sortOption === 'name_asc' && styles.sortOptionTextSelected]}>
                                        Nombre (A-Z)
                                    </Text>
                                    {sortOption === 'name_asc' && <Ionicons name="checkmark" size={20} color={COLORS.blue600} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sortOption, sortOption === 'name_desc' && styles.sortOptionSelected]}
                                    onPress={() => handleSortChange('name_desc')}
                                >
                                    <Text style={[styles.sortOptionText, sortOption === 'name_desc' && styles.sortOptionTextSelected]}>
                                        Nombre (Z-A)
                                    </Text>
                                    {sortOption === 'name_desc' && <Ionicons name="checkmark" size={20} color={COLORS.blue600} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sortOption, sortOption === 'points_desc' && styles.sortOptionSelected]}
                                    onPress={() => handleSortChange('points_desc')}
                                >
                                    <Text style={[styles.sortOptionText, sortOption === 'points_desc' && styles.sortOptionTextSelected]}>
                                        Puntos (Mayor a Menor)
                                    </Text>
                                    {sortOption === 'points_desc' && <Ionicons name="checkmark" size={20} color={COLORS.blue600} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sortOption, sortOption === 'points_asc' && styles.sortOptionSelected]}
                                    onPress={() => handleSortChange('points_asc')}
                                >
                                    <Text style={[styles.sortOptionText, sortOption === 'points_asc' && styles.sortOptionTextSelected]}>
                                        Puntos (Menor a Mayor)
                                    </Text>
                                    {sortOption === 'points_asc' && <Ionicons name="checkmark" size={20} color={COLORS.blue600} />}
                                </TouchableOpacity>
                            </View>

                            {/* Filtros por Comercio */}
                            {comercios.length > 0 && (
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterSectionTitle}>Filtrar por Comercio</Text>
                                    {comercios.map((comercio) => (
                                        <TouchableOpacity
                                            key={comercio}
                                            style={[styles.filterOption, filters.comercio === comercio && styles.filterOptionSelected]}
                                            onPress={() => handleFilterComercio(comercio)}
                                        >
                                            <Text style={[styles.filterOptionText, filters.comercio === comercio && styles.filterOptionTextSelected]}>
                                                {comercio}
                                            </Text>
                                            {filters.comercio === comercio && <Ionicons name="checkmark" size={20} color={COLORS.blue600} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Button
                                title="Aplicar"
                                onPress={() => setShowFilters(false)}
                                style={styles.applyButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <AnalyticsDebug />
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
    skeletonCard: {
        marginBottom: SPACING.md,
        alignSelf: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    favoriteFilterButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselContainer: {
        flex: 1,
    },
    filterButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.red500,
    },
    activeFiltersContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    filtersScroll: {
        paddingHorizontal: SPACING.md,
    },
    activeFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.blue50,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 16,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.blue200,
    },
    activeFilterText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.blue700,
        marginRight: SPACING.xs,
    },
    removeFilterButton: {
        padding: SPACING.xs,
    },
    clearAllButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        justifyContent: 'center',
    },
    clearAllText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.blue600,
        fontWeight: TYPOGRAPHY.weights.medium as any,
    },
    resultsText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray600,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.xs,
    },
    clearFiltersButton: {
        marginTop: SPACING.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    modalTitle: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
    },
    modalCloseButton: {
        padding: SPACING.xs,
    },
    modalBody: {
        padding: SPACING.lg,
    },
    filterSection: {
        marginBottom: SPACING.xl,
    },
    filterSectionTitle: {
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: TYPOGRAPHY.weights.semibold as any,
        color: COLORS.gray900,
        marginBottom: SPACING.md,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 8,
        backgroundColor: COLORS.gray50,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    sortOptionSelected: {
        backgroundColor: COLORS.blue50,
        borderColor: COLORS.blue600,
    },
    sortOptionText: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray700,
    },
    sortOptionTextSelected: {
        color: COLORS.blue700,
        fontWeight: TYPOGRAPHY.weights.medium as any,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 8,
        backgroundColor: COLORS.gray50,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    filterOptionSelected: {
        backgroundColor: COLORS.blue50,
        borderColor: COLORS.blue600,
    },
    filterOptionText: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.gray700,
    },
    filterOptionTextSelected: {
        color: COLORS.blue700,
        fontWeight: TYPOGRAPHY.weights.medium as any,
    },
    modalFooter: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
    },
    applyButton: {
        width: '100%',
    },
});

