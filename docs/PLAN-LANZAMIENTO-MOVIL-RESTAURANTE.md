# Plan de lanzamiento — Omakase Cliente Móvil + Microservicios

**Para:** equipo Restaurante (jsajche, oscar, eddy, kevin, zeta, jztea, pablo)  
**Objetivo:** cerrar el cliente móvil al 100% funcional y listo para exposición  
**Proyecto:** `Restaurante/` — patrón `Banco/deploy-bank`  
**Última revisión:** 2026-07-13 · `main` @ `ad5b373+`

---

## 0. Léeme primero (arquitectura)

```
Restaurante/
├── Gesti-n-de-Restaurante/     # Microservicio API Node + MongoDB (puerto 3006 / Docker 3016)
├── restaurante-frontend/       # Panel admin web (fuera de scope móvil)
├── client-user-restaurant/     # App móvil Expo (dev client, NO Expo Go)
└── deploy-restaurante/         # Orquestación Docker unificada (patrón deploy-bank)
    └── client-user-restaurant/deploy/  # Docker local convive con Banco (3016, 8082, 27018)
```

| Capa | Repo | Rol |
|------|------|-----|
| **Persistencia** | MongoDB `gestor_restaurante` | Órdenes, menús, reservas, cupones, reseñas |
| **API negocio** | `Gesti-n-de-Restaurante` | REST `/GestorRestaurante/v1/*` + JWT |
| **Cliente móvil** | `client-user-restaurant` | React Native + Expo SDK 55 |
| **Deploy** | `deploy/docker-compose.yml` | mongo + node-api + mobile-web |

**Regla:** no usar Expo Go. Mapas requieren dev build (`pnpm start:all`).

---

## 1. Estado actual (post-merge equipo)

### Integrado en `main`

| Rama | Responsable | Módulo |
|------|-------------|--------|
| `ft/oscar` | Oscar | OrderTimerBadge, detalle pedido, crear/listar pedidos |
| `ft/eddy` | Eddy | JWT, authClient, CustomerMenuScreen, layout |
| `ft/kevin` | Kevin | RegisterScreen, validaciones auth |
| `ft/zeta` | Zeta | Factura, cupones, reservas |
| jsajche | Josué | Mapas OSRM, deploy, fixes, merges |

### Completitud estimada

| Área | Código | QA E2E |
|------|--------|--------|
| Login / registro | 95% | 0% |
| Restaurantes / menú (lectura) | 90% | 0% |
| Pedidos | 75% | 0% |
| Reservas | 85% | 0% |
| Cupones / factura | 90% | 0% |
| Contacto | 100% | 0% |
| Mapas nativos | 85% | 0% |
| Reseñas | 5% (stub) | — |
| CI / tests auto | 0% | — |

---

## 2. Gaps bloqueantes (Sprint cierre MVP)

### Epic A — Pedidos end-to-end (P0)

| ID | Tarea | Repo | Archivos clave | Criterio de done |
|----|-------|------|----------------|------------------|
| A1 | Carrito global menú → pedido | móvil | `useCartStore`, `MenuViewModal`, `CustomerOrderCreateScreen` | Usuario agrega plato/bebida desde menú y llega al crear pedido con ítems |
| A2 | Filtrar órdenes por cliente | móvil (+ API si aplica) | `useOrderStore.js`, `orders.controller.js` | Cliente solo ve sus órdenes |
| A3 | QA timer + factura | móvil | `e2e/CLIENT.md` §4 | Checklist marcado en emulador |

### Epic B — Reseñas (P1)

| ID | Tarea | Repo | Archivos clave | Criterio de done |
|----|-------|------|----------------|------------------|
| B1 | Pantalla reseñas funcional | móvil | `CustomerReviewsScreen`, `reviewService` | Lista + crear reseña vía `GET/POST /review` |
| B2 | Navegación desde restaurante | móvil | `RestaurantViewModal`, `MainStack` | Botón reseñas abre pantalla real |

### Epic C — Mapas producción (P1)

| ID | Tarea | Repo | Archivos clave | Criterio de done |
|----|-------|------|----------------|------------------|
| C1 | Google Maps API key vía env | móvil | `app.json`, `.env.example`, `docs/MAPAS.md` | Mapa visible en Android emulador (no gris) |
| C2 | Dev build verificado | móvil | `scripts/start-all.sh` | `AIRMap` disponible sin fallback |

### Epic D — UX reservas (P2)

| ID | Tarea | Repo | Archivos clave | Criterio de done |
|----|-------|------|----------------|------------------|
| D1 | DatePicker + TimePicker | móvil | `CustomerReservationCreateScreen` | Fecha/hora sin texto libre |
| D2 | Editar reserva desde lista | móvil | `CustomerReservationListScreen` | Flujo editar con modal |

### Epic E — Higiene y exposición (P2)

| ID | Tarea | Repo | Archivos clave | Criterio de done |
|----|-------|------|----------------|------------------|
| E1 | Limpiar legado banco | móvil | logo, `bankingClient`, pantallas huérfanas | Sin referencias banco en UI activa |
| E2 | Actualizar `e2e/CLIENT.md` | móvil | puertos 3016, flujo carrito, mapas | Checklist alineado con main |
| E3 | Reemplazar `e2e/ADMIN.md` | móvil | contenido restaurante cliente | Ya no menciona banco |
| E4 | CI `pnpm build:web` | móvil | `.github/workflows/` | PR verifica export web |

---

## 3. Ejecución en paralelo (esta sesión)

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Agente A       │  │  Agente B       │  │  Agente C       │
│  Carrito +      │  │  Órdenes        │  │  Reseñas        │
│  MenuViewModal  │  │  filtro User_id │  │  + review API   │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐
│  Agente D       │  │  Agente E       │  │  QA manual      │
│  Mapas API key  │  │  Limpieza +     │  │  (equipo)       │
│  + reservas UX  │  │  e2e + CI       │  │  e2e/CLIENT.md  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

| Agente | Epics | Entregable |
|--------|-------|------------|
| **A** | A1 | Zustand cart + botones en MenuViewModal |
| **B** | A2 | `fetchOrders({ User_id })` + filtro backend CLIENTE |
| **C** | B1-B2 | CustomerReviewsScreen + service |
| **D** | C1, D1 | app.config maps key + DatePicker reservas |
| **E** | E1-E4 | Legado, docs, workflow CI |

---

## 4. Antes del día de exposición (checklist)

- [ ] `pnpm start:all` en Mac sin errores
- [ ] API health: `http://localhost:3016/GestorRestaurante/v1/health`
- [ ] Login CLIENTE: `cliente@restaurante.com` / `Cliente1234`
- [ ] Flujo: restaurante → menú → carrito → pedido → timer → factura
- [ ] Reserva crear + listar + cancelar
- [ ] Mapa general con marcadores (dev build)
- [ ] Registro nuevo usuario (kevin QA)
- [ ] Credenciales impresas / roles asignados

### Quién hace qué

| Rol | Persona | Responsabilidad |
|-----|---------|-----------------|
| **Operador deploy** | jsajche / pablo | Docker + API + puertos |
| **Narrador** | eddy | Demo menú + auth |
| **Móvil pedidos** | oscar | Timer + factura |
| **Móvil mapas** | jsajche | Dev build + GPS |
| **Reservas/cupones** | zeta | Flujo reserva + PDF |
| **Registro** | kevin | RegisterScreen E2E |

---

## 5. Credenciales

| Rol | Email | Password | Dónde entra |
|-----|-------|----------|-------------|
| **Cliente** | `cliente@restaurante.com` | `Cliente1234` | App móvil Omakase |
| **Admin** | `admin@restaurante.com` | `Admin1234` | Panel web :8082 (NO app cliente) |

---

## 6. Encender el sistema

### Opción A — Un comando (recomendado Mac con Banco)

```bash
cd Restaurante/client-user-restaurant
pnpm start:all
```

### Opción B — Docker manual

```bash
cd Restaurante/client-user-restaurant/deploy
docker compose up -d --build
pnpm dev   # en otra terminal, desde client-user-restaurant
```

| Servicio | URL |
|----------|-----|
| API | http://localhost:3016/GestorRestaurante/v1/health |
| Web Docker | http://localhost:8082 |
| Metro | QR en terminal (:8081) |
| Mongo | localhost:27018 |

---

## 7. Guión de demostración (3 min)

1. **Login** cliente → MainTabs
2. **Restaurantes** → Omakase Demo → ver menú
3. **Menú** → agregar platos al carrito → crear pedido
4. **Órdenes** → timer en vivo → abrir factura PDF
5. **Reservas** → crear para mañana 19:00
6. **Mapa general** → ubicación + ruta OSRM
7. **Cupones** → listar activos

---

## 8. Si algo falla

| Problema | Solución |
|----------|----------|
| `PluginError react-native-maps` | No poner maps en `plugins`; usar `pnpm rebuild:native` |
| "Mapa nativo no disponible" | `rm .expo/native-android-ready && pnpm rebuild:native` |
| Mapa gris Android | Configurar `GOOGLE_MAPS_API_KEY` en `.env` |
| API no responde | `cd deploy && docker compose logs node-api` |
| Admin no entra en app | Correcto: solo rol CLIENTE en móvil |
| localhost en celular | Usar IP Mac o QR Expo, no `localhost` |

---

## 9. Definición de Done (DoD) — cierre proyecto móvil

- [x] Epics A–E en código mergeados a `main` (carrito, reseñas, filtro pedidos, mapas, reservas UX)
- [ ] `e2e/CLIENT.md` 100% marcado por el equipo (QA manual)
- [x] Sin pantallas "Próximamente" en rutas activas (reseñas implementadas)
- [x] Editar reserva desde modal → CreateReservation
- [x] Registro con auto-login CLIENTE
- [ ] Trello sync: GPS físico + API key mapas = único backlog real
- [x] Push `main` sin `Co-authored-by: Cursor`
- [x] Plan lanzamiento en `docs/PLAN-LANZAMIENTO-MOVIL-RESTAURANTE.md`
- [ ] CI GitHub Actions (plantilla en `deploy/templates/build-web.yml`; PAT sin scope `workflow`)

---

## 10. Referencias

- `client-user-restaurant/README-MOBILE.md` — arranque nativo
- `client-user-restaurant/deploy/README.md` — Docker local
- `client-user-restaurant/e2e/CLIENT.md` — checklist QA
- `client-user-restaurant/docs/MAPAS.md` — epic mapas
- `deploy/TRELLO_TASKS.md` — estado kanban
- `docs/GUIA-EXPOSICION-MOVIL-Y-DEPLOY.md` — plantilla Banco (referencia)
