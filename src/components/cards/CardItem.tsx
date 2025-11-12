import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

interface CardItemProps {
    card: WalletCard;
    onPress: () => void;
}

export default function CardItem({ card, onPress }: CardItemProps) {
    const { ticket } = card;
    const puntos = card.ticket.puntos;
    const { marca } = ticket;

    // Colores de la marca o por defecto
    const primaryColor = marca.coloresCorporativos?.[0] || COLORS.blue600;
    const secondaryColor = marca.coloresCorporativos?.[1] || COLORS.indigo600;
    const logoUrl = marca.logotipo?.cdnUrl || marca.logotipo?.url;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={[primaryColor, secondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
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
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        minHeight: 180,
        justifyContent: 'space-between',
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

