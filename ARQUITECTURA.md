# Arquitectura del Proyecto - PetitPrime Wallet

## 🏗️ Visión General

PetitPrime Wallet es una aplicación React Native construida con Expo, siguiendo una arquitectura modular y escalable.

## 📁 Estructura de Directorios

```
petitprime-wallet/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── cards/           # Componentes específicos de tarjetas
│   │   │   ├── CardItem.tsx      # Item de tarjeta en lista
│   │   │   └── QRCode.tsx         # Generador de QR
│   │   └── common/          # Componentes comunes
│   │       ├── Button.tsx         # Botón reutilizable
│   │       ├── Card.tsx           # Contenedor de tarjeta
│   │       └── EmptyState.tsx     # Estado vacío
│   ├── constants/           # Constantes y configuración
│   │   └── config.ts             # Configuración global
│   ├── screens/             # Pantallas de la app
│   │   ├── CardListScreen.tsx    # Lista de tarjetas
│   │   ├── CardDetailScreen.tsx  # Detalle de tarjeta
│   │   ├── AddCardScreen.tsx     # Agregar desde deep link
│   │   └── AddCardManualScreen.tsx # Agregar manualmente
│   ├── services/            # Servicios de API
│   │   └── walletService.ts      # Servicios de wallet
│   ├── types/               # Definiciones TypeScript
│   │   └── index.ts              # Tipos compartidos
│   └── utils/               # Utilidades
│       ├── deepLinking.ts        # Manejo de deep links
│       ├── device.ts             # Gestión de deviceId
│       ├── navigationRef.ts      # Referencia de navegación
│       └── storage.ts            # Almacenamiento local
├── assets/                  # Recursos estáticos
├── App.tsx                  # Componente raíz
├── app.json                 # Configuración Expo
└── package.json             # Dependencias
```

## 🔄 Flujo de Datos

### 1. Agregar Tarjeta

```
Deep Link / Manual Input
    ↓
parseDeepLink()
    ↓
claimCard() → API: POST /wallet/claim
    ↓
Backend Response
    ↓
saveCardLocally() → AsyncStorage
    ↓
Navigation → CardListScreen
```

### 2. Cargar Tarjetas

```
App Opens
    ↓
getWalletCards() → API: GET /wallet/cards
    ↓
Backend Response
    ↓
saveCardLocally() → AsyncStorage (update)
    ↓
Display Cards
```

### 3. Sincronizar Tarjeta

```
User Pulls to Refresh / Sync Button
    ↓
syncCard() → API: GET /wallet/cards/:id/sync
    ↓
Backend Response (updated data)
    ↓
updateLocalCard() → AsyncStorage
    ↓
Update UI
```

## 🧩 Componentes Principales

### App.tsx
- Configuración de navegación
- Setup de deep linking
- Provider de SafeArea

### CardListScreen
- Lista de tarjetas
- Pull-to-refresh
- Navegación a detalles
- Estado vacío

### CardDetailScreen
- Detalle completo de tarjeta
- QR code
- Estadísticas
- Acciones (sync, delete)

### AddCardScreen
- Procesamiento de deep links
- Reclamar tarjeta automáticamente
- Estados de carga/éxito/error

### AddCardManualScreen
- Input de link manual
- Validación de link
- Pegar desde portapapeles
- Reclamar tarjeta

## 🔌 Servicios

### walletService.ts

Funciones principales:
- `claimCard(token, ticketUrl)` - Reclamar tarjeta
- `getWalletCards()` - Obtener todas las tarjetas
- `getCardDetail(cardId)` - Obtener detalle
- `syncCard(cardId)` - Sincronizar tarjeta
- `deleteCard(cardId)` - Eliminar tarjeta
- `syncAllCards()` - Sincronizar todas

### Características:
- Manejo de errores centralizado
- Fallback a caché local
- Actualización automática de almacenamiento local

## 💾 Almacenamiento

### AsyncStorage

**Claves utilizadas**:
- `deviceId` - ID único del dispositivo
- `deviceName` - Nombre del dispositivo
- `walletCards` - Array de tarjetas guardadas

### Estructura de Datos Local

```typescript
interface LocalCard {
  cardId: string;
  ticketUrl: string;
  ticketData: Ticket;
  marca: Marca;
  puntos: number;
  lastSyncedAt: string;
}
```

## 🔗 Deep Linking

### Configuración

**app.json**:
- Scheme: `petitprime://`
- Universal Links: `https://wallet.petitprime.com`
- App Links: Configurados para Android

### Flujo de Deep Link

```
Link Received
    ↓
Linking.addEventListener('url')
    ↓
parseDeepLink(url)
    ↓
Extract token & ticketUrl
    ↓
Navigate to AddCardScreen
    ↓
claimCard(token)
```

### Formatos Soportados

1. `petitprime://claim?token=xxx&ticketUrl=yyy`
2. `https://wallet.petitprime.com/claim?token=xxx&ticketUrl=yyy`
3. `http://localhost:3000/claim?token=xxx&ticketUrl=yyy` (testing)

## 🌐 Integración con Backend

### Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/wallet/claim` | Reclamar tarjeta |
| GET | `/api/wallet/cards?deviceId={id}` | Listar tarjetas |
| GET | `/api/wallet/cards/:cardId?deviceId={id}` | Detalle de tarjeta |
| GET | `/api/wallet/cards/:cardId/sync?deviceId={id}` | Sincronizar |
| DELETE | `/api/wallet/cards/:cardId?deviceId={id}` | Eliminar tarjeta |

### Autenticación

- No requiere autenticación JWT
- Usa `deviceId` para identificar dispositivos
- Tokens de un solo uso para reclamar tarjetas

## 🎨 Sistema de Diseño

### Colores

Definidos en `src/constants/config.ts`:
- Primarios: Azul (#3B82F6) e Índigo (#6366F1)
- Estados: Success, Warning, Error, Info
- Neutros: Escala de grises

### Tipografía

- Sistema de tamaños: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- Pesos: light, normal, medium, semibold, bold

### Componentes de Diseño

- **Button**: Variantes (primary, secondary, danger, success)
- **Card**: Con sombras y bordes redondeados
- **EmptyState**: Icono, título y descripción
- **CardItem**: Gradiente personalizado por marca

## 🔐 Seguridad

### Device ID

- Generado automáticamente al primer uso
- Almacenado localmente
- Único por dispositivo
- Usa expo-device y expo-application

### Tokens

- Tokens de un solo uso
- Expiración automática (7 días)
- Validación en backend

### Almacenamiento

- AsyncStorage (no encriptado actualmente)
- Futuro: SecureStore para datos sensibles

## 📱 Plataformas

### Android

- Configuración en `app.json` → `android`
- Intent Filters para deep links
- Adaptive Icon configurado

### iOS

- Configuración en `app.json` → `ios`
- Associated Domains para Universal Links
- URL Schemes configurados

## 🚀 Build y Deploy

### Desarrollo

```bash
npm start
```

### Producción (Futuro)

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 🔄 Estado de la Aplicación

### Estado Global

Actualmente no usa Redux/Context API. Cada pantalla maneja su propio estado.

**Futuro**: Considerar Context API o Redux para:
- Estado global de tarjetas
- Configuración de usuario
- Estado de sincronización

### Estado Local

- `useState` para estado de componentes
- `AsyncStorage` para persistencia
- `useEffect` para efectos secundarios

## 🧪 Testing (Futuro)

### Estructura Propuesta

```
src/
├── __tests__/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── screens/
```

### Tipos de Tests

- Unit tests (Jest)
- Integration tests
- E2E tests (Detox)

## 📊 Performance

### Optimizaciones Actuales

- Lazy loading de imágenes
- Caché local para offline
- Sincronización inteligente

### Optimizaciones Futuras

- Code splitting
- Image optimization
- Bundle size reduction
- Memoization de componentes

## 🔮 Futuras Mejoras Arquitectónicas

1. **State Management**: Redux o Context API
2. **Caching**: React Query para caché de API
3. **Offline First**: Service Workers / Background Sync
4. **Analytics**: Integración de analytics
5. **Error Tracking**: Sentry o similar
6. **CI/CD**: Pipeline automatizado

---

**Última actualización**: 2025-01-16

