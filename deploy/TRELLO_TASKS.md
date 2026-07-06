# Trello — Cliente Restaurante

Importar manualmente o vía CLI de Trello cuando tengas el board URL.

## Listas

1. Backlog
2. Por hacer
3. En progreso
4. Revisión
5. Listo

---

## Infra & arranque

| Tarjeta | Lista | Asignado |
|---------|-------|----------|
| Crear deploy-restaurante/docker-compose.yml | Listo | — |
| Script start:all en backend | Listo | — |
| README de arranque nativo + troubleshooting | Listo | — |
| Seed usuario CLIENTE + menús demo | Listo | — |

---

## Cliente — MVP login → menú

| Tarjeta | Lista | Asignado |
|---------|-------|----------|
| Fix babel-preset-expo + commit cambios pendientes | Listo | — |
| Fix detallePedidoService circular | Listo | — |
| Fix auth: errores visibles + validar rol antes de login | Listo | — |
| Probar flujo nativo Android/iOS con dev build | Por hacer | Equipo móvil |
| Verificar CustomerMenuScreen + useMenuStore | Por hacer | Equipo móvil |

---

## Órdenes & reservas (fase 2)

| Tarjeta | Lista | Asignado |
|---------|-------|----------|
| Completar OrderTimerBadge + store detalle pedido | Por hacer | Integrante A |
| Permisos POST /reservation para rol CLIENTE en backend | Por hacer | Integrante B |
| Pantallas factura/cupones E2E | Backlog | Integrante A |

---

## Mapas — jsajche-2024380

| Tarjeta | Lista | Asignado |
|---------|-------|----------|
| Plugin react-native-maps en app.json + permisos ubicación | Por hacer | jsajche-2024380 |
| CustomerMapaGeneralScreen: geolocalización + marcadores | Por hacer | jsajche-2024380 |
| CustomerRestaurantMapScreen: mapa por restaurante | Por hacer | jsajche-2024380 |
| Rutas OSRM (tipo Waze) | Backlog | jsajche-2024380 |
| Probar en dispositivo físico (GPS real) | Backlog | jsajche-2024380 |
| Documentar limitaciones web vs nativo | Listo | jsajche-2024380 |

Ver detalle técnico: `client-user-restaurant/docs/MAPAS.md`

---

## Deploy & QA (fase posterior)

| Tarjeta | Lista | Asignado |
|---------|-------|----------|
| Docker mobile con EXPO_PUBLIC_* build-args | Listo | — |
| Actualizar e2e/ADMIN.md para restaurante cliente | Backlog | QA |
| CI: pnpm build:web en PR | Backlog | DevOps |

---

## CLI Trello (cuando tengas token)

```bash
# Ejemplo con trello-cli (npm i -g trello-cli)
trello addcard --board "Cliente Restaurante" --list "Por hacer" \
  --title "Probar flujo nativo Android/iOS" \
  --desc "Login cliente@restaurante.com → pestaña Menú"
```
