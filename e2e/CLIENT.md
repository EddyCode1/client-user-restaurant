# Pruebas E2E — Cliente Restaurante (Manual)

App: `client-user-restaurant` · Backend: `Gesti-n-de-Restaurante` en `:3016` (Docker) o `:3006` (dev local)

## Prerequisitos

```bash
# Backend (Docker — recomendado)
cd Restaurante/client-user-restaurant/deploy
cp .env.example .env
docker compose up -d

# O backend local
cd Gesti-n-de-Restaurante
docker compose up -d && pnpm dev

# Cliente (nativo — no Expo Go)
cd client-user-restaurant
cp .env.example .env
pnpm install
pnpm prebuild && pnpm run:android   # o run:ios
```

Verificar API: `curl http://localhost:3016/GestorRestaurante/v1/health`

**Usuario CLIENTE:** `cliente@restaurante.com` / `Cliente1234`

---

## 1) Login

- [ ] Login con CLIENTE → entra a MainTabs
- [ ] Login con ADMIN → muestra "Acceso denegado"
- [ ] Credenciales incorrectas → muestra error

## 2) Restaurantes

- [ ] Pestaña Restaurantes lista "Omakase Demo"
- [ ] Ver detalle / navegar a menú

## 3) Menú

- [ ] Pestaña Menú muestra Sushi Roll y Ramen Tradicional
- [ ] MenuViewModal abre detalle (platos/bebidas)

## 4) Carrito

- [ ] Desde Menú o RestaurantMenu, abrir MenuViewModal
- [ ] Tap "Agregar al carrito" en plato o bebida → alerta de confirmación
- [ ] Ir a Órdenes → Crear pedido (`CustomerOrderCreateScreen`)
- [ ] Sección "Items en carrito" muestra productos y subtotal
- [ ] Quitar item del carrito desde la pantalla de pedido
- [ ] Confirmar pedido con carrito → `saveOrderWithDetails` crea orden + detalle

## 5) Pedidos

- [ ] Crear pedido desde CustomerOrderCreateScreen
  - [ ] Seleccionar domicilio
  - [ ] Seleccionar menú
  - [ ] Seleccionar cupón (opcional) + validar
- [ ] Ver pedido en CustomerOrdersScreen
  - [ ] Timer cuenta correctamente (mm:ss)
  - [ ] Barra de progreso avanza
  - [ ] Si timer falla, mostrar error con botón "Reintentar"
  - [ ] Orden se marca como completada cuando timer llega a 100%
  - [ ] Órdenes se actualizan en tiempo real (polling cada 5s)
- [ ] Navegar a factura + ver detalles

## 6) Reservas

- [ ] Listar reservas
- [ ] Crear reserva (requiere permiso CLIENTE en backend)

## 7) Cupones / Factura / Contacto

- [ ] CuponesScreen carga sin crash
- [ ] FacturaScreen carga sin crash
- [ ] ContactScreen carga sin crash

## 8) Mapas (dev build nativo)

> Mapas requieren **dev build** (`expo run:android` / `run:ios`). Expo Go no sirve.

- [ ] Primera vez: `pnpm start:all` o `pnpm rebuild:native`
- [ ] Mapa general muestra marcadores de restaurantes
- [ ] Mapa por restaurante centra en lat/lng
- [ ] Rutas OSRM dibujan polyline (nativo)
- [ ] Web (`pnpm build:web`): placeholder documentado — mapa nativo no disponible

---

Reportar: pantalla en blanco, error de red, crash al navegar.

Ver también: `README-MOBILE.md`, `deploy/README.md`, `docs/MAPAS.md`
