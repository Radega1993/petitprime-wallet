import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { analytics } from '../../services/analyticsService';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';

/**
 * Componente de debug para ver eventos de analytics
 * Solo visible en desarrollo (__DEV__)
 */
export default function AnalyticsDebug() {
    const [events, setEvents] = useState(analytics.getEvents());
    const [visible, setVisible] = useState(false);

    if (!__DEV__) {
        return null;
    }

    const refreshEvents = () => {
        setEvents([...analytics.getEvents()]);
    };

    const clearEvents = () => {
        analytics.clearEvents();
        setEvents([]);
    };

    if (!visible) {
        return (
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setVisible(true)}
            >
                <Text style={styles.toggleButtonText}>📊</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Analytics Debug</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={refreshEvents} style={styles.button}>
                        <Text style={styles.buttonText}>🔄</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearEvents} style={styles.button}>
                        <Text style={styles.buttonText}>🗑️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.button}>
                        <Text style={styles.buttonText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                {events.length === 0 ? (
                    <Text style={styles.emptyText}>No hay eventos aún</Text>
                ) : (
                    events
                        .slice()
                        .reverse()
                        .map((event, index) => (
                            <View key={index} style={styles.eventItem}>
                                <Text style={styles.eventName}>{event.event}</Text>
                                <Text style={styles.eventTime}>
                                    {event.timestamp.toLocaleTimeString()}
                                </Text>
                                {Object.keys(event.properties).length > 0 && (
                                    <Text style={styles.eventProperties}>
                                        {JSON.stringify(event.properties, null, 2)}
                                    </Text>
                                )}
                            </View>
                        ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 300,
        maxHeight: 400,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
    },
    toggleButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.blue600,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
    },
    toggleButtonText: {
        fontSize: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.bold as any,
        color: COLORS.gray900,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    button: {
        padding: SPACING.xs,
    },
    buttonText: {
        fontSize: 18,
    },
    scrollView: {
        maxHeight: 300,
    },
    eventItem: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    eventName: {
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: TYPOGRAPHY.weights.semibold as any,
        color: COLORS.blue600,
        marginBottom: SPACING.xs,
    },
    eventTime: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.gray500,
        marginBottom: SPACING.xs,
    },
    eventProperties: {
        fontSize: TYPOGRAPHY.sizes.xs,
        color: COLORS.gray600,
        fontFamily: 'monospace',
    },
    emptyText: {
        padding: SPACING.lg,
        textAlign: 'center',
        color: COLORS.gray500,
    },
});

