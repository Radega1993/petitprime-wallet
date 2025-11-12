# Changelog - PetitPrime Wallet

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.2.0] - 2025-01-16

### ✨ Agregado
- **Sistema de Favoritos**
  - Botón de favorito en cada tarjeta con animación
  - Almacenamiento persistente de favoritos en AsyncStorage
  - Filtro para mostrar solo tarjetas favoritas
  - Integración con búsqueda y otros filtros
  - Tracking de eventos `card_favorited` y `card_unfavorited`

- **Vista Carrusel**
  - Componente `CarouselView` para navegación horizontal
  - Indicadores de página con animación
  - Contador de tarjetas (X / Y)
  - Toggle entre vista lista y carrusel
  - Compatible con favoritos y filtros

- **Búsqueda y Filtros Avanzados**
  - Barra de búsqueda en tiempo real
  - Búsqueda por nombre de comercio, cliente y eslogan
  - Filtros por comercio con modal intuitivo
  - Ordenamiento por nombre (A-Z, Z-A) y puntos (mayor/menor)
  - UI de filtros activos con opción de limpiar
  - Contador de resultados cuando hay filtros activos

### 🔧 Mejorado
- Preservación de favoritos al sincronizar tarjetas
- Actualización en tiempo real del estado de favoritos
- Mejor organización de tarjetas con múltiples vistas

### 📝 Documentación
- Actualizado `ESTADO.md` con nuevas funcionalidades
- Actualizado `PENDIENTES.md` con tareas completadas
- Actualizado `PLAN_ACCION.md` con progreso de Fase 3

## [1.1.0] - 2025-01-16

### ✨ Agregado
- **Sistema de Analytics Completo**
  - Servicio de analytics con 10 tipos de eventos trackeados
  - Componente de debug para ver eventos en desarrollo
  - Tracking integrado en todas las pantallas principales
  - Preparado para integración con Firebase Analytics

- **Pantalla de Error Mejorada**
  - Componente `ErrorDisplay` reutilizable
  - Pantalla `ErrorScreen` dedicada con 6 tipos de errores
  - Sugerencias contextuales según el tipo de error
  - Navegación automática para errores críticos

- **Animaciones y Transiciones**
  - Transiciones suaves entre pantallas (spring animation)
  - Animaciones en tarjetas (fade in + scale)
  - Feedback visual en botones (press animation)
  - Skeleton loaders con efecto shimmer
  - Animaciones en todas las pantallas principales

- **Assets**
  - Icono de la app (`icon.png`)
  - Splash screen (`splash.png`)
  - Configuración de adaptive icon para Android

### 🔧 Mejorado
- Mejor manejo de errores con tipos específicos
- UX mejorada con animaciones fluidas
- Feedback visual en todas las interacciones
- Estados de carga más informativos

### 📝 Documentación
- Agregado `ANALYTICS.md` con guía completa de analytics
- Actualizado `ESTADO.md` con nuevas funcionalidades
- Actualizado `PENDIENTES.md` con tareas completadas
- Agregado `ASSETS_NEEDED.md` con especificaciones de assets

## [1.0.0] - 2025-01-16

### ✨ Agregado
- **MVP Funcional (Fase 1)**
  - Agregar tarjetas desde deep links
  - Visualizar lista de tarjetas
  - Detalle de tarjeta con QR code
  - Sincronización con servidor
  - Eliminación de tarjetas
  - Agregar tarjetas manualmente
  - Almacenamiento local con AsyncStorage
  - Identificación de dispositivo única

- **Componentes Base**
  - Button, Card, EmptyState
  - CardItem, QRCode
  - Pantallas: CardList, CardDetail, AddCard, AddCardManual

- **Servicios**
  - walletService para operaciones de API
  - Utilidades de deep linking
  - Manejo de almacenamiento local

- **Documentación Inicial**
  - README.md
  - ESTADO.md
  - PENDIENTES.md
  - CASOS_USO.md
  - ARQUITECTURA.md
  - CONFIG.md
  - TESTING.md
  - QUICK_START.md
  - FIXES.md

---

**Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)**

