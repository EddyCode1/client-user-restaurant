# Pruebas E2E — Cliente Restaurante (Manual)

App: `client-user-restaurant` · Backend: `Gesti-n-de-Restaurante` en `:3006`

## Prerequisitos

```bash
# Backend
cd Gesti-n-de-Restaurante
docker compose up -d && pnpm dev

# Cliente (nativo — no Expo Go)
cd client-user-restaurant
cp .env.example .env
pnpm install
pnpm prebuild && pnpm run:android   # o run:ios
```

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

## 4) Pedidos

- [ ] Crear pedido desde CustomerOrderCreateScreen
  - [ ] Seleccionar domicilio
  - [ ] Seleccionar menú
  - [ ] Seleccionar cupón (opcional) + validar
  - [ ] Ver carrito con items (si tiene)
- [ ] Ver pedido en CustomerOrdersScreen
  - [ ] Timer cuenta correctamente (mm:ss)
  - [ ] Barra de progreso avanza
  - [ ] Si timer falla, mostrar error con botón "Reintentar"
  - [ ] Orden se marca como completada cuando timer llega a 100%
  - [ ] Órdenes se actualizan en tiempo real (polling cada 5s)
- [ ] Navegar a factura + ver detalles

## 5) Reservas

- [ ] Listar reservas
- [ ] Crear reserva (requiere permiso CLIENTE en backend)

## 6) Cupones / Factura / Contacto

- [ ] CuponesScreen carga sin crash
- [ ] FacturaScreen carga sin crash
- [ ] ContactScreen carga sin crash

## 7) Mapas (nativo)

- [ ] Mapa general muestra marcadores
- [ ] Mapa por restaurante centra en lat/lng

---

Reportar: pantalla en blanco, error de red, crash al navegar.

Ver también: `README-MOBILE.md`, `deploy/README.md`
