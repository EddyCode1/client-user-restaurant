# Cliente móvil — Arranque nativo

Guía rápida para desarrollo Android/iOS. Ver también [`deploy/README.md`](deploy/README.md).

## Requisitos

- Node 22 + pnpm
- Android Studio (emulador) o dispositivo físico
- Backend en `:3006` (ver deploy-restaurante)

> **No uses Expo Go.** Esta app requiere dev build por `expo-dev-client` y `react-native-maps`.

## Setup

```bash
pnpm install
cp .env.example .env
```

### `.env` según plataforma

| Entorno            | EXPO_PUBLIC_DEV_HOST |
|--------------------|----------------------|
| Emulador Android   | (dejar localhost; usa 10.0.2.2 automático) |
| Simulador iOS      | localhost            |
| Dispositivo físico | IP de tu Mac (ej. 192.168.1.45) |

Actualiza también `EXPO_PUBLIC_AUTH_URL` y `EXPO_PUBLIC_API_BASE` con la misma IP en dispositivo físico.

## Dev build

```bash
pnpm prebuild
pnpm run:android    # o pnpm run:ios
```

Para desarrollo con hot reload después del primer build:

```bash
pnpm dev
```

## Credenciales de prueba

| Email                   | Password     | Rol     |
|-------------------------|--------------|---------|
| cliente@restaurante.com | Cliente1234  | CLIENTE |

## Flujo MVP

1. Login con usuario CLIENTE
2. MainTabs carga automáticamente
3. Pestaña **Menú** → GET `/menu` con JWT

## Mapas (jsajche)

Ver [`docs/MAPAS.md`](docs/MAPAS.md) para la epic de mapas nativos.
