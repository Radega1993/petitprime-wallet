# 📊 Guía de Analytics - PetitPrime Wallet

## 🎯 Sistema de Métricas Implementado

El sistema de analytics trackea eventos importantes de la app para entender el comportamiento de los usuarios y mejorar la experiencia.

## 🔍 Cómo Probar las Analytics

### 1. Componente de Debug (Solo en Desarrollo)

En modo desarrollo (`__DEV__`), verás un botón flotante 📊 en la esquina inferior derecha de la pantalla principal (`CardListScreen`).

**Pasos para probar:**
1. Abre la app en modo desarrollo
2. En la pantalla "Mis Tarjetas", busca el botón 📊 en la esquina inferior derecha
3. Toca el botón para abrir el panel de debug
4. Realiza acciones en la app y observa cómo se registran los eventos

### 2. Ver Eventos en la Consola

Todos los eventos se registran en la consola con el formato:
```
[Analytics] nombre_evento { propiedades }
```

**Ejemplo:**
```
[Analytics] app_opened { timestamp: "2025-01-16T10:30:00.000Z" }
[Analytics] card_added { cardId: "abc123", method: "deep_link", timestamp: "..." }
```

### 3. Probar Eventos Específicos

#### 📱 Apertura de App
- **Evento**: `app_opened`
- **Cómo probar**: Simplemente abre la app
- **Dónde ver**: Consola inmediatamente al iniciar

#### ➕ Agregar Tarjeta (Deep Link)
- **Evento**: `deep_link_opened` + `card_added`
- **Cómo probar**: 
  1. Abre un link de tarjeta desde el email
  2. O usa: `petitprime://claim?token=TU_TOKEN&ticketUrl=TU_TICKET`
- **Dónde ver**: Consola cuando se abre el link y cuando se agrega la tarjeta

#### ✏️ Agregar Tarjeta (Manual)
- **Evento**: `manual_add_used` + `card_added`
- **Cómo probar**:
  1. Toca el botón "+" en la pantalla principal
  2. Pega un link de tarjeta
  3. Toca "Agregar Tarjeta"
- **Dónde ver**: Consola cuando usas la función manual

#### 👁️ Ver Tarjeta
- **Evento**: `card_viewed`
- **Cómo probar**: Toca cualquier tarjeta en la lista
- **Dónde ver**: Consola al abrir el detalle

#### 🔄 Sincronizar Tarjeta
- **Evento**: `card_synced`
- **Cómo probar**:
  1. Abre el detalle de una tarjeta
  2. Toca "Sincronizar"
- **Dónde ver**: Consola después de sincronizar

#### 📱 Ver QR Code
- **Evento**: `qr_displayed`
- **Cómo probar**: Abre el detalle de una tarjeta (el QR se muestra automáticamente)
- **Dónde ver**: Consola cuando se renderiza el QR

#### 🗑️ Eliminar Tarjeta
- **Evento**: `card_deleted`
- **Cómo probar**:
  1. Abre el detalle de una tarjeta
  2. Toca "Eliminar tarjeta"
  3. Confirma la eliminación
- **Dónde ver**: Consola después de eliminar

#### 🔄 Pull to Refresh
- **Evento**: `pull_to_refresh`
- **Cómo probar**: Desliza hacia abajo en la lista de tarjetas
- **Dónde ver**: Consola después de refrescar

#### ❌ Errores
- **Evento**: `error_occurred`
- **Cómo probar**: 
  - Intenta agregar una tarjeta con un token expirado
  - Intenta agregar una tarjeta ya agregada
  - Desconecta internet y realiza una acción
- **Dónde ver**: Consola cuando ocurre un error

## 📋 Eventos Disponibles

| Evento | Descripción | Propiedades |
|--------|-------------|-------------|
| `app_opened` | App abierta | `timestamp` |
| `card_added` | Tarjeta agregada | `cardId`, `method` (deep_link/manual), `timestamp` |
| `card_viewed` | Tarjeta visualizada | `cardId`, `timestamp` |
| `card_deleted` | Tarjeta eliminada | `cardId`, `timestamp` |
| `card_synced` | Tarjeta sincronizada | `cardId`, `hasUpdates`, `timestamp` |
| `qr_displayed` | QR mostrado | `cardId`, `timestamp` |
| `deep_link_opened` | Deep link abierto | `source` (email/manual), `timestamp` |
| `manual_add_used` | Agregar manual usado | `timestamp` |
| `pull_to_refresh` | Pull to refresh | `cardCount`, `timestamp` |
| `error_occurred` | Error ocurrido | `errorType`, `errorMessage`, `context`, `timestamp` |

## 🛠️ Uso del Componente de Debug

El componente `AnalyticsDebug` muestra:

1. **Lista de eventos**: Todos los eventos trackeados en orden cronológico (más recientes primero)
2. **Propiedades**: Cada evento muestra sus propiedades en formato JSON
3. **Timestamp**: Hora exacta de cada evento

**Controles:**
- 🔄 **Refrescar**: Actualiza la lista de eventos
- 🗑️ **Limpiar**: Elimina todos los eventos del historial
- ✕ **Cerrar**: Oculta el panel

## 📊 Integración con Servicios Externos

El sistema está preparado para integrarse con servicios de analytics externos. Para agregar Firebase Analytics:

```typescript
// En analyticsService.ts, dentro del método track():
import * as Analytics from 'expo-firebase-analytics';

// Agregar después de console.log:
if (!__DEV__) {
  Analytics.logEvent(event, properties);
}
```

## 🔧 Configuración Avanzada

### Habilitar/Deshabilitar Analytics

```typescript
import { analytics } from './src/services/analyticsService';

// Deshabilitar
analytics.setEnabled(false);

// Habilitar
analytics.setEnabled(true);
```

### Obtener Eventos Programáticamente

```typescript
import { analytics } from './src/services/analyticsService';

const events = analytics.getEvents();
console.log('Total eventos:', events.length);
```

### Limpiar Eventos

```typescript
import { analytics } from './src/services/analyticsService';

analytics.clearEvents();
```

## 📝 Notas Importantes

1. **Solo en Desarrollo**: El componente de debug solo aparece cuando `__DEV__ === true`
2. **Límite de Memoria**: Los eventos se limitan a 100 en memoria para evitar consumo excesivo
3. **Producción**: En producción, los eventos deberían enviarse a un servicio externo (Firebase, Mixpanel, etc.)
4. **Privacidad**: Los eventos no contienen información personal sensible, solo IDs de tarjetas y acciones

## 🚀 Próximos Pasos

- [ ] Integrar Firebase Analytics para producción
- [ ] Agregar dashboard de métricas en el backend
- [ ] Implementar retención de eventos offline
- [ ] Agregar más propiedades contextuales (versión de app, OS, etc.)

---

**Última actualización**: 2025-01-16

