# Assets Necesarios - PetitPrime Wallet

## 📸 Imágenes Requeridas

### 1. Icono de la App (Obligatorio para producción)

**Ubicación**: `assets/icon.png`

**Especificaciones**:
- **Tamaño**: 1024x1024 píxeles
- **Formato**: PNG
- **Fondo**: Transparente o sólido (recomendado: fondo sólido con el color de marca)
- **Contenido**: Logo de PetitPrime o icono representativo de wallet
- **Estilo**: Moderno, limpio, reconocible en tamaños pequeños

**Recomendaciones**:
- Usar el logo de PetitPrime si está disponible
- Si no, crear un icono de wallet/cartera con los colores corporativos (azul #3B82F6)
- Asegurar que sea legible en 20x20px (tamaño mínimo en iOS)

---

### 2. Splash Screen (Obligatorio para producción)

**Ubicación**: `assets/splash.png`

**Especificaciones**:
- **Tamaño**: 1284x2778 píxeles (iPhone 14 Pro Max) o 1242x2688 (iPhone XS Max)
- **Formato**: PNG
- **Fondo**: Color sólido #3B82F6 (azul PetitPrime) o gradiente azul-índigo
- **Contenido**: Logo de PetitPrime centrado, opcionalmente con texto "PetitPrime Wallet"
- **Orientación**: Portrait (vertical)

**Recomendaciones**:
- Logo centrado verticalmente
- Texto opcional debajo del logo: "PetitPrime Wallet"
- Usar colores corporativos: azul (#3B82F6) e índigo (#6366F1)
- Mantener diseño minimalista

---

### 3. Adaptive Icon Android (Obligatorio para Android)

**Ubicación**: `assets/adaptive-icon.png`

**Especificaciones**:
- **Tamaño**: 1024x1024 píxeles
- **Formato**: PNG
- **Fondo**: Transparente (el sistema aplicará el color de fondo)
- **Contenido**: Logo/icono centrado, dejando espacio para el "safe zone" (márgenes)
- **Safe Zone**: Dejar ~100px de margen en cada lado (el contenido visible será ~824x824px)

**Recomendaciones**:
- Mismo diseño que icon.png pero con márgenes seguros
- El sistema Android puede recortar los bordes, así que mantener contenido importante en el centro

---

### 4. Favicon (Opcional - solo para web)

**Ubicación**: `assets/favicon.png`

**Especificaciones**:
- **Tamaño**: 32x32 o 64x64 píxeles
- **Formato**: PNG o ICO
- **Contenido**: Versión pequeña del logo

**Nota**: Actualmente no es crítico ya que la app es principalmente móvil.

---

## 🎨 Guía de Diseño para Assets

### Colores a Usar

- **Primario**: #3B82F6 (Azul)
- **Secundario**: #6366F1 (Índigo)
- **Fondo Splash**: #3B82F6 o gradiente azul-índigo
- **Texto**: #FFFFFF (Blanco) sobre fondos oscuros

### Tipografía

- **Logo**: Usar la tipografía corporativa de PetitPrime
- **Texto Splash**: Sans-serif, bold, blanco

### Estilo

- **Minimalista**: Menos es más
- **Profesional**: Reflejar la marca PetitPrime
- **Moderno**: Diseño actual y limpio

---

## 📁 Estructura de Carpetas

```
assets/
├── icon.png              (1024x1024) - REQUERIDO
├── splash.png            (1284x2778) - REQUERIDO
├── adaptive-icon.png     (1024x1024) - REQUERIDO para Android
└── favicon.png           (32x32 o 64x64) - OPCIONAL
```

---

## 🛠️ Herramientas Recomendadas

### Para Crear los Assets

1. **Figma** - Diseño vectorial y exportación
2. **Adobe Illustrator** - Diseño profesional
3. **Canva** - Opción más simple
4. **Online Tools**:
   - https://www.appicon.co/ - Generador de iconos
   - https://makeappicon.com/ - Generador completo

### Para Optimizar

- **TinyPNG** - Comprimir PNGs sin perder calidad
- **ImageOptim** - Optimización de imágenes

---

## ✅ Checklist

- [x] `icon.png` - 1024x1024px creado ✅
- [x] `splash.png` - 1284x2778px creado ✅
- [x] `adaptive-icon.png` - 1024x1024px creado ✅
- [ ] Assets optimizados (tamaño de archivo razonable) - Opcional
- [ ] Assets probados en la app - Pendiente de probar en build

---

## 📝 Notas Importantes

1. **Mientras creas los assets**: La app funcionará sin ellos, solo verás placeholders
2. **Testing**: Una vez creados, reemplázalos en la carpeta `assets/` y reinicia la app
3. **Producción**: Los assets son obligatorios para publicar en App Store y Play Store
4. **Actualización**: Si cambias los assets, necesitarás hacer un nuevo build

---

**Última actualización**: 2025-01-16

