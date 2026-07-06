# Epic Mapas — Cliente Restaurante

**Responsable:** jsajche-2024380

## Estado actual

- [`MapViewCompat.jsx`](../src/shared/components/MapViewCompat.jsx): placeholder en web, mapa nativo en Android/iOS
- Pantallas: `CustomerMapaGeneralScreen`, `CustomerRestaurantMapScreen`
- Backend expone `lat`, `lng`, `hasLocation` en restaurantes
- Restaurante demo seed: Omakase Demo en Zona 10 (14.6349, -90.5069)

## Tareas

### 1. Configuración nativa
- [ ] Añadir Google Maps API key en `app.json` (plugin `react-native-maps`) si se requiere en producción
- [ ] Probar permisos de ubicación en dispositivo físico
- [ ] Verificar marcadores con datos reales de `GET /restaurant`

### 2. CustomerMapaGeneralScreen
- [ ] Obtener ubicación del usuario (`expo-location`)
- [ ] Mostrar marcadores de todos los restaurantes con `hasLocation: true`
- [ ] Centrar mapa en usuario o en Ciudad de Guatemala por defecto

### 3. CustomerRestaurantMapScreen
- [ ] Mapa centrado en un restaurante específico
- [ ] Popup con nombre y dirección

### 4. Rutas OSRM (tipo Waze)
- [ ] Integrar API gratuita OSRM: `https://router.project-osrm.org/route/v1/driving/{lng},{lat};{lng},{lat}`
- [ ] Dibujar `Polyline` con coordenadas de la ruta
- [ ] Mostrar distancia y tiempo estimado
- [ ] Reutilizar lógica del frontend web si existe en `restaurante-frontend/src/features/mapa/`

### 5. QA
- [ ] Probar en Android físico con GPS
- [ ] Probar en iOS simulador (ubicación simulada)
- [ ] Documentar que web sigue usando placeholder

## Referencias

- Backend: `Gesti-n-de-Restaurante/src/models/restaurant.model.js` (lat, lng)
- Compat web: `src/shared/components/MapViewCompat.jsx`
