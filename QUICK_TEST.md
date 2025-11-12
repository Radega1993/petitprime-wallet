# Testing Rápido - Links HTTP Locales

## ⚠️ Importante

Los links HTTP (`http://localhost:3000/...`) **NO se abren automáticamente** desde el navegador como los deep links. Esto es normal porque HTTP no es un esquema de deep linking nativo.

## ✅ Solución: Usar la Pantalla Manual

La forma más fácil de probar con links HTTP locales es:

1. **Copia el link completo**:
   ```
   http://localhost:3000/claim?token=3d6904bdd6a3681fb7c4573e69fc6baee14b26befed081fb2c00511e93c939c6&ticketUrl=6d344f13-351a-4018-abd4-c54ab2a8c46e
   ```

2. **Abre la app PetitPrime Wallet**

3. **Toca el botón "+"** en la esquina superior derecha

4. **Pega el link** en el campo de texto (o usa el botón "Pegar")

5. **Toca "Agregar Tarjeta"**

## 🔧 Alternativa: Usar Deep Link Real

Si quieres probar el deep linking automático, usa el formato:

```
petitprime://claim?token=3d6904bdd6a3681fb7c4573e69fc6baee14b26befed081fb2c00511e93c939c6&ticketUrl=6d344f13-351a-4018-abd4-c54ab2a8c46e
```

Este link SÍ se abrirá automáticamente en la app si está instalada.

## 📱 Probar Deep Link Automático

### Android (ADB)
```bash
adb shell am start -W -a android.intent.action.VIEW -d "petitprime://claim?token=TU_TOKEN&ticketUrl=TU_TICKET_URL" com.petitprime.wallet
```

### iOS (Simulator)
```bash
xcrun simctl openurl booted "petitprime://claim?token=TU_TOKEN&ticketUrl=TU_TICKET_URL"
```

## 🎯 Resumen

- ✅ **Links HTTP**: Funcionan cuando los pegas manualmente en la app
- ✅ **Deep Links (`petitprime://`)**: Se abren automáticamente desde cualquier lugar
- ✅ **Universal Links (`https://wallet.petitprime.com`)**: Se abren automáticamente (requiere configuración en producción)

Para testing rápido, usa la pantalla manual con el link HTTP.

