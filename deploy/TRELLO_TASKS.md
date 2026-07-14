# Trello — Cliente Restaurante

**Board:** [gestion-de-restaurante](https://trello.com/b/DeIhDyk9/gestion-de-restaurante)

Última sync con código: **2026-07-13** (`deploy/sync-trello-from-code.mjs`)

## Comandos

```bash
pnpm trello:sync-code    # mover tarjetas según main
node deploy/trello-cli.mjs cards
```

---

## Listo (código verificado en main — `b776ccd`)

| Tarjeta | Asignado | Merge / commit |
|---------|----------|----------------|
| Infra: docker-compose, seed, babel, auth, detallePedido, README, Docker mobile | — | main |
| Mapas: pantallas, OSRM, autolinking (sin plugin) | jsajche | c93868b |
| Push main + deploy/README | jsajche | b776ccd |
| OrderTimerBadge + detalle pedido | oscar | **ft/oscar** `c266f1b` |
| Flujo pedidos crear + listar | oscar | **ft/oscar** `c266f1b` |
| Permisos POST /reservation CLIENTE (backend) | pablo | backend main |
| Factura/cupones E2E | zeta | **ft/zeta** `4c712e0` |
| Pantalla reservas listar + crear | zeta | **ft/zeta** `4c712e0` |
| Lista y detalle restaurantes | kevin | main |
| MenuViewModal platos/bebidas | jztea | main `12f8bc3` |
| CustomerMenuScreen + useMenuStore | eddy | **ft/eddy** `b9c04cc` |
| RegisterScreen + registro CLIENTE | kevin | **ft/kevin** `e2267d8` |
| Fix auth JWT + errores visibles | eddy | **ft/eddy** `b9c04cc` |
| Fix ContactScreen, start:all, pedidos/reservas | jsajche | main |

### Ramas integradas en main

| Rama | Estado |
|------|--------|
| `ft/oscar` | Mergeado |
| `ft/eddy` | Mergeado |
| `ft/kevin` | Mergeado |
| `ft/zeta` | Mergeado (antes) |

---

## Revisión (código listo — falta QA manual equipo)

| Tarjeta | Asignado |
|---------|----------|
| Probar flujo nativo Android/iOS (`pnpm start:all`) | kevin |
| Registro CLIENTE E2E (nuevo usuario) | kevin |
| Menú + JWT en emulador | eddy |
| Timer pedidos + reintentar detalle | oscar |

---

## Pendiente (no terminado en código)

| Tarjeta | Asignado | Por qué |
|---------|----------|---------|
| Probar GPS en dispositivo físico | jsajche | Requiere celular real + dev build con mapas |
| Actualizar e2e/ADMIN.md para cliente | jztea | Sigue contenido del módulo banco |
| CI: pnpm build:web en PR | eddy | No hay workflow en .github |
| Google Maps API key Android (mapa gris) | jsajche | Opcional para producción |

---

## Mapas — jsajche

| Tarea | Estado |
|-------|--------|
| Pantallas + OSRM + autolinking | Listo |
| GPS dispositivo físico | Pendiente |
| `pnpm rebuild:native` / `start:all` para mapa en emulador | Revisión QA |
