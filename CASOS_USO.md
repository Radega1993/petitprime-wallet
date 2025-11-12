# Casos de Uso - PetitPrime Wallet

## 📋 Índice

1. [Casos de Uso Principales](#casos-de-uso-principales)
2. [Flujos de Usuario](#flujos-de-usuario)
3. [Escenarios de Error](#escenarios-de-error)
4. [Casos Especiales](#casos-especiales)

---

## Casos de Uso Principales

### CU-1: Agregar Tarjeta desde Email

**Actor**: Cliente  
**Precondición**: Cliente ha recibido un email con su tarjeta de fidelización

**Flujo Principal**:
1. Cliente recibe email con botón "Agregar a Wallet PetitPrime"
2. Cliente toca el botón en el email
3. Si la app está instalada, se abre automáticamente
4. Si la app no está instalada, se redirige a App Store/Play Store
5. La app procesa el deep link y extrae el token
6. La app llama al endpoint `/api/wallet/claim` con el token
7. El backend valida el token y retorna los datos de la tarjeta
8. La app guarda la tarjeta localmente
9. La app muestra mensaje de éxito
10. La app navega a la lista de tarjetas mostrando la nueva tarjeta

**Flujo Alternativo 1 - Token Inválido**:
1. Cliente toca el botón en el email
2. La app intenta reclamar la tarjeta
3. El backend retorna error (token inválido/expirado)
4. La app muestra mensaje de error explicativo
5. La app ofrece opción de volver a la lista

**Flujo Alternativo 2 - Tarjeta Ya Agregada**:
1. Cliente toca el botón en el email
2. La app intenta reclamar la tarjeta
3. El backend detecta que la tarjeta ya existe para este dispositivo
4. El backend retorna la tarjeta existente
5. La app muestra mensaje informativo
6. La app navega a la lista de tarjetas

---

### CU-2: Agregar Tarjeta Manualmente

**Actor**: Cliente  
**Precondición**: Cliente tiene un link de tarjeta (deepLink o universalLink)

**Flujo Principal**:
1. Cliente abre la app PetitPrime Wallet
2. Cliente toca el botón "+" en la esquina superior derecha
3. La app muestra la pantalla "Agregar Tarjeta"
4. Cliente copia el link desde el email o panel de administración
5. Cliente toca el botón "Pegar" o pega manualmente en el campo
6. La app valida que el link contenga un token
7. Cliente toca "Agregar Tarjeta"
8. La app procesa el link y extrae el token
9. La app llama al endpoint `/api/wallet/claim` con el token
10. El backend valida el token y retorna los datos de la tarjeta
11. La app guarda la tarjeta localmente
12. La app muestra mensaje de éxito
13. La app navega automáticamente a la lista de tarjetas

**Flujo Alternativo - Link Inválido**:
1. Cliente pega un link sin token o mal formado
2. La app valida el link
3. La app muestra mensaje de error: "El link no contiene un token válido"
4. Cliente puede corregir el link o cancelar

---

### CU-3: Ver Lista de Tarjetas

**Actor**: Cliente  
**Precondición**: Cliente tiene al menos una tarjeta agregada

**Flujo Principal**:
1. Cliente abre la app PetitPrime Wallet
2. La app muestra la pantalla "Mis Tarjetas"
3. La app sincroniza automáticamente todas las tarjetas
4. La app muestra todas las tarjetas del dispositivo
5. Cada tarjeta muestra:
   - Logo del comercio
   - Nombre del comercio
   - Puntos actuales
   - Nombre del cliente
6. Cliente puede hacer pull-to-refresh para sincronizar
7. Cliente puede tocar una tarjeta para ver detalles

**Flujo Alternativo - Sin Tarjetas**:
1. Cliente abre la app
2. La app detecta que no hay tarjetas
3. La app muestra estado vacío con mensaje
4. La app muestra botón "Agregar Tarjeta Manualmente"
5. Cliente puede agregar su primera tarjeta

**Flujo Alternativo - Error de Conexión**:
1. Cliente abre la app
2. La app intenta sincronizar pero falla la conexión
3. La app muestra las tarjetas desde caché local
4. La app muestra indicador de que los datos pueden estar desactualizados

---

### CU-4: Ver Detalle de Tarjeta

**Actor**: Cliente  
**Precondición**: Cliente tiene al menos una tarjeta agregada

**Flujo Principal**:
1. Cliente está en la lista de tarjetas
2. Cliente toca una tarjeta
3. La app navega a la pantalla de detalle
4. La app muestra:
   - Header con logo y nombre del comercio
   - Puntos actuales destacados
   - Progreso hacia siguiente premio (si aplica)
   - Código QR para acumulación
   - Estadísticas (visitas, monto acumulado, canjes)
5. Cliente puede tocar "Actualizar puntos" para sincronizar
6. Cliente puede tocar "Eliminar tarjeta" para eliminarla

**Flujo Alternativo - Sincronizar Puntos**:
1. Cliente está en el detalle de la tarjeta
2. Cliente toca "Actualizar puntos"
3. La app muestra indicador de carga
4. La app llama al endpoint `/api/wallet/cards/:cardId/sync`
5. El backend retorna datos actualizados
6. La app actualiza la pantalla con nuevos puntos
7. La app muestra mensaje de éxito

---

### CU-5: Usar Código QR en Tienda

**Actor**: Cliente  
**Precondición**: Cliente tiene una tarjeta agregada

**Flujo Principal**:
1. Cliente está en el detalle de su tarjeta
2. Cliente ve el código QR
3. Cliente va a la tienda física
4. Cliente muestra el código QR al empleado
5. Empleado escanea el código QR
6. El sistema del comercio acumula puntos
7. Cliente abre la app más tarde
8. La app sincroniza automáticamente al abrir
9. Cliente ve sus puntos actualizados

---

### CU-6: Eliminar Tarjeta

**Actor**: Cliente  
**Precondición**: Cliente tiene al menos una tarjeta agregada

**Flujo Principal**:
1. Cliente está en el detalle de una tarjeta
2. Cliente toca "Eliminar tarjeta"
3. La app muestra diálogo de confirmación
4. Cliente confirma la eliminación
5. La app llama al endpoint `/api/wallet/cards/:cardId` (DELETE)
6. El backend elimina la tarjeta del dispositivo
7. La app elimina la tarjeta del almacenamiento local
8. La app muestra mensaje de éxito
9. La app navega de vuelta a la lista de tarjetas

**Flujo Alternativo - Cancelar Eliminación**:
1. Cliente toca "Eliminar tarjeta"
2. La app muestra diálogo de confirmación
3. Cliente toca "Cancelar"
4. La app cierra el diálogo
5. Cliente permanece en el detalle de la tarjeta

---

## Flujos de Usuario

### Flujo 1: Primer Uso - Cliente Nuevo

```
1. Cliente recibe email con tarjeta
   ↓
2. Cliente toca "Agregar a Wallet"
   ↓
3. App se instala (si no está instalada)
   ↓
4. App se abre automáticamente
   ↓
5. App procesa deep link
   ↓
6. App agrega tarjeta
   ↓
7. App muestra lista con una tarjeta
   ↓
8. Cliente puede ver detalles y usar QR
```

### Flujo 2: Uso Regular - Cliente Existente

```
1. Cliente abre app
   ↓
2. App sincroniza tarjetas automáticamente
   ↓
3. Cliente ve lista de tarjetas actualizadas
   ↓
4. Cliente toca tarjeta para ver detalles
   ↓
5. Cliente usa QR en tienda
   ↓
6. Cliente abre app más tarde
   ↓
7. App sincroniza y muestra puntos actualizados
```

### Flujo 3: Agregar Múltiples Tarjetas

```
1. Cliente tiene tarjeta de Comercio A
   ↓
2. Cliente recibe email de Comercio B
   ↓
3. Cliente agrega tarjeta de Comercio B
   ↓
4. App muestra ambas tarjetas en lista
   ↓
5. Cliente puede alternar entre tarjetas
   ↓
6. Cada tarjeta mantiene sus puntos independientes
```

---

## Escenarios de Error

### E-1: Token Expirado

**Escenario**: Cliente intenta agregar tarjeta con token expirado

**Flujo**:
1. Cliente toca link con token expirado
2. App intenta reclamar tarjeta
3. Backend retorna error: "Token expirado"
4. App muestra mensaje: "El token ha expirado. Por favor, solicita un nuevo link desde el email."
5. App ofrece opción de volver a la lista

### E-2: Sin Conexión a Internet

**Escenario**: Cliente intenta usar la app sin conexión

**Flujo**:
1. Cliente abre app sin conexión
2. App detecta falta de conexión
3. App muestra tarjetas desde caché local
4. App muestra indicador de "modo offline"
5. Cliente puede ver tarjetas pero no sincronizar
6. Cuando recupera conexión, app sincroniza automáticamente

### E-3: Backend No Disponible

**Escenario**: Backend está caído o no responde

**Flujo**:
1. Cliente intenta agregar tarjeta
2. App intenta conectar con backend
3. Request falla por timeout
4. App muestra mensaje: "No se pudo conectar con el servidor. Verifica tu conexión."
5. App ofrece reintentar o cancelar

### E-4: Tarjeta Ya Existe

**Escenario**: Cliente intenta agregar tarjeta que ya tiene

**Flujo**:
1. Cliente toca link de tarjeta ya agregada
2. App intenta reclamar tarjeta
3. Backend detecta duplicado
4. Backend retorna tarjeta existente
5. App muestra mensaje: "Esta tarjeta ya está en tu wallet"
6. App navega a la tarjeta existente

---

## Casos Especiales

### CS-1: Cambio de Dispositivo

**Escenario**: Cliente cambia de móvil

**Flujo Actual**:
1. Cliente instala app en nuevo dispositivo
2. Cliente debe agregar tarjetas nuevamente desde emails
3. Cada tarjeta genera un nuevo deviceId

**Flujo Futuro (Fase 4)**:
1. Cliente instala app en nuevo dispositivo
2. Cliente puede restaurar tarjetas desde backup en la nube
3. O reenviar tarjetas desde el panel de administración

### CS-2: Múltiples Dispositivos

**Escenario**: Cliente usa la app en varios dispositivos

**Flujo**:
1. Cliente agrega tarjeta en Dispositivo A
2. Cliente agrega misma tarjeta en Dispositivo B
3. Cada dispositivo tiene su propio deviceId
4. Backend permite múltiples dispositivos por cliente
5. Cada dispositivo mantiene su propia copia local

### CS-3: Tarjeta Eliminada por Error

**Escenario**: Cliente elimina tarjeta por error

**Flujo Actual**:
1. Cliente debe agregar tarjeta nuevamente desde email
2. Si el token expiró, debe solicitar nuevo email

**Flujo Futuro (Fase 4)**:
1. Cliente puede restaurar desde historial
2. O reenviar tarjeta desde panel

---

## Métricas de Uso

### Eventos a Trackear (Futuro)

- `card_added` - Tarjeta agregada
- `card_viewed` - Tarjeta visualizada
- `qr_scanned` - QR usado en tienda
- `card_synced` - Tarjeta sincronizada
- `card_deleted` - Tarjeta eliminada
- `app_opened` - App abierta
- `deep_link_opened` - Deep link procesado
- `manual_add_used` - Agregar manual usado

---

**Última actualización**: 2025-01-16

