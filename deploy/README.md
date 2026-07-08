# Deploy Restaurante — Cliente + Backend

Levantamiento unificado siguiendo el patrón de `Banco/deploy-bank`.

## Requisitos

- Docker Desktop
- Node 22 + pnpm (solo para desarrollo nativo local)

## Opción A — Todo con Docker

```bash
cd Restaurante/client-user-restaurant/deploy
cp .env.example .env
docker compose up --build
```

| Servicio    | URL                                              |
|-------------|--------------------------------------------------|
| API         | http://localhost:3016/GestorRestaurante/v1/health |
| Cliente web | http://localhost:8082                            |
| MongoDB     | localhost:27018                                  |

> Puertos 3016/8082/27018 si 3006/8081/27017 están ocupados (ej. banco).

## Opción A+ — Docker + app nativa con mapas (un comando)

Desde la raíz del cliente móvil:

```bash
pnpm install
pnpm start:all
```

Levanta Docker, compila Android con mapas la primera vez, y abre Metro.

### Usuarios de prueba (seed automático al iniciar API)

| Rol     | Email                   | Password     |
|---------|-------------------------|--------------|
| Admin   | admin@restaurante.com   | Admin1234    |
| Cliente | cliente@restaurante.com | Cliente1234 |

## Opción B — Desarrollo nativo (Android/iOS)

> **Expo Go no sirve.** Usa dev build (`expo run:android` / `expo run:ios`).

### 1. Backend

```bash
cd Restaurante/Gesti-n-de-Restaurante
docker compose up -d          # solo MongoDB
pnpm install
pnpm dev                      # API en :3006
```

O un solo comando:

```bash
pnpm start:all
```

Verificar:

```bash
curl http://localhost:3006/GestorRestaurante/v1/health
```

### 2. Cliente móvil

```bash
cd Restaurante/client-user-restaurant
cp .env.example .env
pnpm install
```

**Emulador Android:** no cambies `EXPO_PUBLIC_DEV_HOST` (usa `10.0.2.2` automáticamente).

**Dispositivo físico:** pon la IP de tu Mac en `.env`:

```env
EXPO_PUBLIC_DEV_HOST=192.168.x.x
EXPO_PUBLIC_AUTH_URL=http://192.168.x.x:3006/GestorRestaurante/v1/auth
EXPO_PUBLIC_API_BASE=http://192.168.x.x:3006/GestorRestaurante/v1
```

### 3. Dev build nativo

```bash
npx expo prebuild
npx expo run:android    # o run:ios
```

### 4. Probar MVP login → menú

1. Login: `cliente@restaurante.com` / `Cliente1234`
2. Debe aparecer MainTabs
3. Pestaña **Menú** → debe listar "Sushi Roll Especial" y "Ramen Tradicional"

## Troubleshooting

| Problema | Solución |
|----------|----------|
| App no conecta al API | Verifica IP en `.env`; prueba `curl` desde el teléfono |
| Puerto 27017 ocupado | Para el Mongo de banco o cambia puerto en compose |
| Build falla babel | `pnpm add -D babel-preset-expo` |
| Mapa vacío en web | Normal; mapa nativo solo en Android/iOS |

## Estructura

```
deploy-restaurante/
├── docker-compose.yml   # mongo + api + mobile web
├── .env.example
└── README.md
```
