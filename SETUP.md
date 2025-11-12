# Setup Guide - PetitPrime Wallet

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start

# 3. Ejecutar en iOS
npm run ios

# 4. Ejecutar en Android
npm run android
```

## Configuración de Deep Links

La app está configurada para recibir deep links en los formatos:
- `petitprime://claim?token=xxx&ticketUrl=yyy`
- `https://wallet.petitprime.com/claim?token=xxx&ticketUrl=yyy`

## Estructura del Proyecto

- `src/components/` - Componentes reutilizables (Button, Card, EmptyState, CardItem, QRCode)
- `src/screens/` - Pantallas principales (CardList, CardDetail, AddCard)
- `src/services/` - Servicios de API (walletService)
- `src/utils/` - Utilidades (deepLinking, device, storage, navigationRef)
- `src/constants/` - Constantes y configuración (colores, tipografía)
- `src/types/` - Definiciones TypeScript

## Funcionalidades Implementadas (Fase 1 MVP)

✅ Reclamar tarjeta con token desde email
✅ Ver lista de tarjetas del dispositivo
✅ Ver detalle de tarjeta con QR y puntos
✅ Sincronización automática de puntos
✅ Almacenamiento local para uso offline
✅ Diseño siguiendo guía de estilos PetitPrime

## Próximos Pasos

1. Agregar assets (icon.png, splash.png, adaptive-icon.png)
2. Probar deep links con tokens reales
3. Configurar certificados para producción
4. Implementar Fase 2 (mejoras adicionales)

