// API Configuration
// Para Android Emulator: usa 'http://10.0.2.2:3000/api'
// Para iOS Simulator o dispositivo físico: usa 'http://localhost:3000/api' o 'http://TU_IP:3000/api'
export const API_BASE_URL = __DEV__
    ? 'http://10.0.2.2:3000/api'  // Android Emulator - 10.0.2.2 es el localhost del host
    : 'https://api.petitprime.com/api';

// Storage Keys
export const STORAGE_KEYS = {
    DEVICE_ID: 'deviceId',
    WALLET_CARDS: 'walletCards',
    DEVICE_NAME: 'deviceName',
} as const;

// Deep Link Configuration
export const DEEP_LINK_SCHEME = 'petitprime';
export const DEEP_LINK_HOST = 'claim';
export const UNIVERSAL_LINK_DOMAIN = 'wallet.petitprime.com';

// Colors from PetitPrime Design System
export const COLORS = {
    // Primary
    blue50: '#EFF6FF',
    blue100: '#DBEAFE',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',

    // Indigo (Secondary)
    indigo500: '#6366F1',
    indigo600: '#4F46E5',
    indigo700: '#4338CA',

    // Success
    green100: '#D1FAE5',
    green500: '#10B981',
    green600: '#059669',
    green700: '#047857',

    // Warning
    yellow100: '#FEF3C7',
    yellow500: '#F59E0B',
    yellow600: '#D97706',

    // Error
    red100: '#FEE2E2',
    red500: '#EF4444',
    red600: '#DC2626',
    red700: '#B91C1C',

    // Neutral
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // White/Black
    white: '#FFFFFF',
    black: '#000000',
} as const;

// Typography
export const TYPOGRAPHY = {
    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
} as const;

// Spacing
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
} as const;

