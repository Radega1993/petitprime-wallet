# Inicio Rápido - PetitPrime Wallet

## ✅ Problema Resuelto

El error de `expo-router` ha sido corregido. El plugin fue eliminado de `app.json` ya que no lo estamos usando.

## 🚀 Iniciar el Proyecto

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd ~/Proyectos/petitprime-wallet

# 2. Iniciar el servidor de desarrollo
npm start
```

## 📱 Opciones de Ejecución

Una vez que `npm start` esté corriendo, verás un código QR y opciones:

- **Presiona `i`** - Para abrir en iOS Simulator (requiere Xcode)
- **Presiona `a`** - Para abrir en Android Emulator (requiere Android Studio)
- **Escanea el QR** - Con Expo Go en tu dispositivo físico
- **Presiona `w`** - Para abrir en navegador web

## ⚠️ Nota sobre Assets

Si ves errores sobre archivos de assets faltantes (icon.png, splash.png), puedes:

1. **Opción temporal**: Crear archivos placeholder en `assets/`:
   - `icon.png` (1024x1024px)
   - `splash.png` (1284x2778px recomendado)
   - `adaptive-icon.png` (1024x1024px)

2. **O ignorar por ahora**: La app funcionará sin ellos, solo verás placeholders.

## 🔗 Probar Deep Links

Para probar los deep links localmente:

```bash
# En iOS Simulator
xcrun simctl openurl booted "petitprime://claim?token=test123&ticketUrl=test-url"

# En Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "petitprime://claim?token=test123&ticketUrl=test-url" com.petitprime.wallet
```

## 📝 Próximos Pasos

1. ✅ El proyecto debería iniciar correctamente ahora
2. 📱 Probar en un dispositivo o emulador
3. 🎨 Agregar assets reales cuando estén listos
4. 🔗 Probar deep links con tokens reales del backend

## 🐛 Si Encuentras Errores

- **Error de módulos**: Ejecuta `npm install` nuevamente
- **Error de TypeScript**: Verifica que `tsconfig.json` esté correcto
- **Error de navegación**: Asegúrate de que todas las dependencias estén instaladas

