# PetitPrime Wallet

Aplicación móvil React Native para gestionar tarjetas de fidelización digitales de PetitPrime. Permite a los clientes recibir, visualizar y gestionar sus tarjetas de puntos desde su dispositivo móvil.

## 📱 Características

- ✅ **Agregar tarjetas** desde email mediante deep linking
- ✅ **Agregar tarjetas manualmente** pegando el link
- ✅ **Visualizar tarjetas** con puntos y códigos QR
- ✅ **Sincronización automática** de puntos al abrir la app
- ✅ **Almacenamiento local** para uso offline
- ✅ **Diseño moderno** siguiendo la guía de estilos PetitPrime
- ✅ **Soporte para múltiples tarjetas** de diferentes comercios

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (para Android) o Xcode (para iOS)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd petitprime-wallet

# 2. Instalar dependencias
npm install

# 3. Configurar URL del backend (ver CONFIG.md)
# Editar src/constants/config.ts con tu URL de backend

# 4. Iniciar el servidor de desarrollo
npm start
```

### Ejecutar en Dispositivos

```bash
# Android Emulator
npm run android

# iOS Simulator
npm run ios

# Dispositivo físico (usando Expo Go)
# Escanear el código QR que aparece en la terminal
```

## ⚙️ Configuración

### Backend API

Edita `src/constants/config.ts` para configurar la URL de tu backend:

```typescript
export const API_BASE_URL = __DEV__
    ? 'http://10.0.2.2:3000/api'  // Android Emulator
    : 'https://api.petitprime.com/api';
```

**Nota importante:**
- **Android Emulator**: Usa `http://10.0.2.2:PUERTO/api`
- **iOS Simulator**: Usa `http://localhost:PUERTO/api`
- **Dispositivo físico**: Usa `http://TU_IP:PUERTO/api`

Ver [CONFIG.md](./CONFIG.md) para más detalles.

## 📖 Documentación

- [**ESTADO.md**](./ESTADO.md) - Estado actual del proyecto y funcionalidades implementadas
- [**PENDIENTES.md**](./PENDIENTES.md) - Funcionalidades pendientes por implementar
- [**CASOS_USO.md**](./CASOS_USO.md) - Casos de uso y flujos de usuario
- [**CONFIG.md**](./CONFIG.md) - Guía de configuración del backend
- [**TESTING.md**](./TESTING.md) - Guía de testing y deep links
- [**ARQUITECTURA.md**](./ARQUITECTURA.md) - Arquitectura del proyecto

## 🏗️ Estructura del Proyecto

```
petitprime-wallet/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── cards/           # Componentes de tarjetas
│   │   └── common/          # Componentes comunes (Button, Card, etc.)
│   ├── constants/           # Constantes y configuración
│   ├── screens/             # Pantallas de la app
│   ├── services/             # Servicios de API
│   ├── types/                # Definiciones TypeScript
│   └── utils/                # Utilidades (deep linking, storage, etc.)
├── assets/                   # Imágenes y recursos
├── App.tsx                   # Componente principal
└── package.json              # Dependencias
```

## 🔗 Deep Linking

La app soporta múltiples formatos de deep links:

- **Deep Link**: `petitprime://claim?token=xxx&ticketUrl=yyy`
- **Universal Link**: `https://wallet.petitprime.com/claim?token=xxx&ticketUrl=yyy`
- **HTTP Local** (testing): `http://localhost:3000/claim?token=xxx&ticketUrl=yyy`

Ver [TESTING.md](./TESTING.md) para más detalles.

## 📡 API Backend

La app se conecta a la API de PetitPrime. Endpoints utilizados:

- `POST /api/wallet/claim` - Reclamar tarjeta con token
- `GET /api/wallet/cards?deviceId={id}` - Obtener tarjetas del dispositivo
- `GET /api/wallet/cards/:cardId?deviceId={id}` - Detalle de tarjeta
- `GET /api/wallet/cards/:cardId/sync?deviceId={id}` - Sincronizar tarjeta
- `DELETE /api/wallet/cards/:cardId?deviceId={id}` - Eliminar tarjeta

Ver documentación del backend para más detalles.

## 🎨 Sistema de Diseño

La app sigue el sistema de diseño PetitPrime:

- **Colores principales**: Azul (#3B82F6) e Índigo (#6366F1)
- **Tipografía**: System fonts con escalas definidas
- **Componentes**: Botones con gradientes, tarjetas con sombras
- **Espaciado**: Sistema consistente basado en múltiplos de 4

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Testing manual de deep links
# Ver TESTING.md para instrucciones detalladas
```

## 📦 Build y Deploy

### Desarrollo

```bash
npm start
```

### Producción

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 🐛 Troubleshooting

### Error: "Cannot POST /api/wallet/claim"

- Verifica que el backend esté corriendo
- Verifica la URL en `src/constants/config.ts`
- Para Android Emulator, usa `10.0.2.2` en lugar de `localhost`

### Error: Assets faltantes

Los assets (icon.png, splash.png) son opcionales para desarrollo. La app funcionará sin ellos.

### Deep links no funcionan

- Verifica la configuración en `app.json`
- Para testing, usa la pantalla manual de agregar tarjeta

## 📝 Licencia

Propietario - PetitPrime

## 👥 Contribuidores

- Equipo de Desarrollo PetitPrime

## 📞 Soporte

Para dudas o problemas:
- Email: soporte@petitprime.com
- Documentación API: https://api.petitprime.com/docs

---

**Versión**: 1.0.0 (MVP - Fase 1)  
**Última actualización**: 2025-01-16
