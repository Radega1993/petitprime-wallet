import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setupDeepLinkListener } from './src/utils/deepLinking';
import { navigationRef } from './src/utils/navigationRef';
import { trackAppOpened } from './src/services/analyticsService';
import CardListScreen from './src/screens/CardListScreen';
import CardDetailScreen from './src/screens/CardDetailScreen';
import AddCardScreen from './src/screens/AddCardScreen';
import AddCardManualScreen from './src/screens/AddCardManualScreen';
import ErrorScreen from './src/screens/ErrorScreen';
import { COLORS } from './src/constants/config';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        // Trackear apertura de la app
        trackAppOpened();

        // Configurar listener de deep links
        const cleanup = setupDeepLinkListener((params) => {
            // Navegar a la pantalla de agregar tarjeta cuando se recibe un deep link
            if (navigationRef.isReady()) {
                navigationRef.navigate('AddCard' as never, params as never);
            }
        });

        return cleanup;
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer
                ref={navigationRef}
                linking={{
                    prefixes: [
                        'petitprime://',
                        'https://wallet.petitprime.com',
                        'http://localhost:3000', // Para testing local
                        'http://192.168.1.144:3000', // Para testing en red local
                    ],
                    config: {
                        screens: {
                            CardList: '',
                            AddCard: {
                                path: 'claim',
                                parse: {
                                    token: (value: string) => value,
                                    ticketUrl: (value: string) => value,
                                },
                            },
                            CardDetail: 'card/:cardId',
                        },
                    },
                }}
            >
                <StatusBar style="auto" />
                <Stack.Navigator
                    initialRouteName="CardList"
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: COLORS.gray50 },
                        transitionSpec: {
                            open: {
                                animation: 'spring',
                                config: {
                                    stiffness: 1000,
                                    damping: 500,
                                    mass: 3,
                                    overshootClamping: true,
                                    restDisplacementThreshold: 0.01,
                                    restSpeedThreshold: 0.01,
                                },
                            },
                            close: {
                                animation: 'spring',
                                config: {
                                    stiffness: 1000,
                                    damping: 500,
                                    mass: 3,
                                    overshootClamping: true,
                                    restDisplacementThreshold: 0.01,
                                    restSpeedThreshold: 0.01,
                                },
                            },
                        },
                        cardStyleInterpolator: ({ current, next, layouts }) => {
                            return {
                                cardStyle: {
                                    transform: [
                                        {
                                            translateX: current.progress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [layouts.screen.width, 0],
                                            }),
                                        },
                                        {
                                            scale: next
                                                ? next.progress.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 0.9],
                                                })
                                                : 1,
                                        },
                                    ],
                                    opacity: current.progress.interpolate({
                                        inputRange: [0, 0.5, 0.9, 1],
                                        outputRange: [0, 0.25, 0.7, 1],
                                    }),
                                },
                            };
                        },
                    }}
                >
                    <Stack.Screen name="CardList" component={CardListScreen} />
                    <Stack.Screen name="CardDetail" component={CardDetailScreen} />
                    <Stack.Screen name="AddCard" component={AddCardScreen} />
                    <Stack.Screen name="AddCardManual" component={AddCardManualScreen} />
                    <Stack.Screen name="Error" component={ErrorScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

