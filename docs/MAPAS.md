# Epic Mapas — Cliente Restaurante

**Responsable:** jsajche-2024380

## Estado actual

- [`MapViewCompat.web.jsx`](../src/shared/components/MapViewCompat.web.jsx) / [`.native.jsx`](../src/shared/components/MapViewCompat.native.jsx): MapView, Marker, Polyline, Callout
- [`osrmService.js`](../src/shared/utils/osrmService.js): rutas OSRM gratuitas
- [`useUserLocation.js`](../src/shared/hooks/useUserLocation.js): GPS con expo-location
- Pantallas: `CustomerMapaGeneralScreen`, `CustomerRestaurantMapScreen`
- Navegación: `MainStack` → `MapaGeneral`, `RestaurantMap`
- Backend: `lat`, `lng`, `hasLocation` en restaurantes

## Tareas

### 1. Configuración nativa
- [x] `react-native-maps` instalado + permisos ubicación en `app.json`
- [x] Split web/native (`MapViewCompat.*`) para `expo export --platform web`
- [ ] Google Maps API key en producción (opcional)
- [ ] Probar permisos en dispositivo físico

### 2. CustomerMapaGeneralScreen
- [x] Ubicación del usuario
- [x] Marcadores de restaurantes ubicados
- [x] Rutas OSRM con Polyline
- [x] Banner distancia/tiempo

### 3. CustomerRestaurantMapScreen
- [x] Mapa centrado en restaurante
- [x] Panel nombre/dirección
- [x] Botón ruta OSRM + Waze

### 4. Rutas OSRM
- [x] API `router.project-osrm.org`
- [x] Polyline en mapa nativo
- [x] Distancia y tiempo estimado

### 5. QA pendiente (dispositivo físico)
- [ ] Probar GPS Android/iOS
- [x] Web usa placeholder documentado
