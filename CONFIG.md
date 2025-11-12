# Configuración de la API

## 🔧 Cambiar URL del Backend

Para testing local, edita el archivo `src/constants/config.ts`:

```typescript
export const API_BASE_URL = __DEV__
    ? 'http://localhost:3000/api'  // Tu backend local
    : 'https://api.petitprime.com/api';
```

### Opciones comunes:

- **Backend local**: `http://localhost:3000/api`
- **Backend en red local**: `http://192.168.1.144:3000/api` (reemplaza con tu IP)
- **Backend de producción**: `https://api.petitprime.com/api`

## 📝 Notas

- La URL debe incluir `/api` al final si tu backend tiene ese prefijo
- Asegúrate de que el backend esté corriendo antes de probar
- Para Android emulator, usa `http://10.0.2.2:3000/api` en lugar de `localhost`
- Para iOS simulator, `localhost` funciona directamente

## 🐛 Troubleshooting

Si ves errores como "Cannot POST /api/wallet/claim":

1. Verifica que el backend esté corriendo
2. Verifica que la URL en `config.ts` sea correcta
3. Verifica que el endpoint `/api/wallet/claim` exista en tu backend
4. Para Android, prueba con `http://10.0.2.2:3000/api` en lugar de `localhost`

