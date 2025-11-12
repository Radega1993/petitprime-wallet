# Guía de Testing - Deep Links

## 🔗 Probar Deep Links

La app soporta varios formatos de links para agregar tarjetas:

### Formatos Soportados

1. **Deep Link (Producción)**:
   ```
   petitprime://claim?token=xxx&ticketUrl=yyy
   ```

2. **Universal Link (Producción)**:
   ```
   https://wallet.petitprime.com/claim?token=xxx&ticketUrl=yyy
   ```

3. **HTTP Local (Testing)**:
   ```
   http://localhost:3000/claim?token=xxx&ticketUrl=yyy
   ```

4. **HTTP Red Local (Testing)**:
   ```
   http://192.168.1.144:3000/claim?token=xxx&ticketUrl=yyy
   ```

## 📱 Cómo Probar

### Opción 1: Desde el Navegador (Solo Android)

1. Abre el navegador en tu dispositivo/emulador
2. Navega a: `http://localhost:3000/claim?token=xxx&ticketUrl=yyy`
3. La app debería abrirse automáticamente

### Opción 2: Desde la App (Agregar Manualmente)

1. Abre la app PetitPrime Wallet
2. Toca el botón "+" en la esquina superior derecha
3. Pega el link completo en el campo de texto
4. Toca "Agregar Tarjeta"

### Opción 3: Usando ADB (Android)

```bash
adb shell am start -W -a android.intent.action.VIEW -d "http://localhost:3000/claim?token=xxx&ticketUrl=yyy" com.petitprime.wallet
```

### Opción 4: Usando Simctl (iOS)

```bash
xcrun simctl openurl booted "http://localhost:3000/claim?token=xxx&ticketUrl=yyy"
```

## ⚠️ Notas Importantes

- Los links HTTP locales solo funcionan en desarrollo/testing
- Para producción, usa los formatos `petitprime://` o `https://wallet.petitprime.com`
- El token debe estar presente en el link
- El ticketUrl es opcional pero recomendado

## 🐛 Troubleshooting

Si el link no funciona:

1. **Verifica que el link tenga el formato correcto**:
   - Debe contener `token=`
   - Debe tener el path `/claim`

2. **Verifica la configuración de linking**:
   - En `App.tsx` están configurados los prefixes permitidos
   - Si usas otro puerto o IP, agrégalo a la lista de prefixes

3. **Prueba desde la app manualmente**:
   - Usa la pantalla "Agregar Tarjeta Manualmente"
   - Pega el link completo
   - Esto siempre funciona si el link tiene el formato correcto

