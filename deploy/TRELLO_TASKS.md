# Trello — Cliente Restaurante

**Board:** [gestion-de-restaurante](https://trello.com/b/DeIhDyk9/gestion-de-restaurante)

Última sync con código: **2026-07-08** (`deploy/sync-trello-from-code.mjs`)

## Comandos

```bash
pnpm trello:sync-code    # mover tarjetas según main
node deploy/trello-cli.mjs cards
```

---

## Listo (código verificado en main)

| Tarjeta | Asignado |
|---------|----------|
| Infra: docker-compose, seed, babel, auth, detallePedido, README, Docker mobile | — |
| Mapas: plugin, pantallas, OSRM, docs web vs nativo | jsajche |
| Push main + deploy/README | jsajche |
| OrderTimerBadge + detalle pedido | oscar |
| Flujo pedidos crear + listar | oscar |
| Permisos POST /reservation CLIENTE (backend) | pablo |
| Factura/cupones E2E (merge ft/zeta) | zeta |
| Pantalla reservas listar + crear | zeta |
| Lista y detalle restaurantes | kevin |
| MenuViewModal platos/bebidas | jztea |
| CustomerMenuScreen + useMenuStore | eddy |
| RegisterScreen + registro CLIENTE | eddy |
| Fix ContactScreen, start:all, pedidos/reservas | jsajche |

---

## Revisión (código listo — falta QA manual equipo)

| Tarjeta | Asignado |
|---------|----------|
| Probar flujo nativo Android/iOS (`pnpm start:all`) | kevin |

---

## Pendiente (no terminado en código)

| Tarjeta | Asignado | Por qué |
|---------|----------|---------|
| Probar GPS en dispositivo físico | jsajche | Requiere celular real + dev build con mapas |
| Actualizar e2e/ADMIN.md para cliente | jztea | Sigue contenido del módulo banco |
| CI: pnpm build:web en PR | eddy | No hay workflow en .github |

---

## Mapas — jsajche

| Tarea | Estado |
|-------|--------|
| Plugin + pantallas + OSRM | Listo |
| GPS dispositivo físico | Pendiente |
| `pnpm rebuild:native` / `start:all` para mapa en emulador | Revisión QA |
