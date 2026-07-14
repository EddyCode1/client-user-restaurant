# Trello — Cliente Restaurante

**Board:** [gestion-de-restaurante](https://trello.com/b/DeIhDyk9/gestion-de-restaurante)

Última sync con código: **2026-07-13** (cierre MVP — epics A–E)

**Plan completo:** [`docs/PLAN-LANZAMIENTO-MOVIL-RESTAURANTE.md`](../docs/PLAN-LANZAMIENTO-MOVIL-RESTAURANTE.md)

## Comandos

```bash
pnpm trello:sync-code
node deploy/trello-cli.mjs cards
```

---

## Listo (código en main)

| Epic | Tarjeta | Responsable |
|------|---------|-------------|
| Infra | docker-compose, seed, start:all, deploy | jsajche |
| Mapas | pantallas OSRM, autolinking, app.config Google key | jsajche |
| Pedidos | OrderTimerBadge, flujo crear/listar, **carrito Zustand** | oscar + jsajche |
| Pedidos | **Filtro User_id** solo pedidos del cliente | jsajche |
| Auth | JWT, menú, RegisterScreen | eddy + kevin |
| Reservas / factura | zeta merge + DatePicker reservas | zeta + jsajche |
| Reseñas | listar + crear reseña | jsajche |
| Higiene | logo Omakase, e2e CLIENT/ADMIN, CI build:web | jsajche + eddy |
| Backend | filtro órdenes CLIENTE | jsajche |

Ramas `ft/oscar`, `ft/eddy`, `ft/kevin`, `ft/zeta` → **mergeadas**.

---

## Revisión (QA manual — equipo)

| Tarjeta | Asignado |
|---------|----------|
| Probar flujo nativo (`pnpm start:all`) | kevin |
| Carrito menú → pedido → factura | oscar |
| Registro nuevo usuario | kevin |
| Menú + JWT | eddy |
| Reservas + cupones + PDF | zeta |
| Mapas dev build + GPS físico | jsajche |

Checklist: `e2e/CLIENT.md`

---

## Pendiente real

| Tarjeta | Por qué |
|---------|---------|
| GPS dispositivo físico | Requiere celular + dev build |
| Google Maps API key en `.env` | Opcional; sin key mapa gris en Android |
| Editar reserva desde UI | Código parcial (Epic D2) |

---

## Mapas

| Tarea | Estado |
|-------|--------|
| Pantallas + OSRM + app.config | Listo |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Configurar en `.env` + rebuild |
| GPS físico | Pendiente QA |
