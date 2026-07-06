# Trello CLI — Gestión de Restaurante

Board: [gestion-de-restaurante](https://trello.com/b/DeIhDyk9/gestion-de-restaurante)

## Credenciales (guardadas localmente)

Archivo: `deploy/.env.trello` (gitignored, no se sube a GitHub)

| Variable | Qué es |
|----------|--------|
| `TRELLO_KEY` | API Key de tu app Trello |
| `TRELLO_OAUTH_SECRET` | Secreto OAuth (solo para flujo OAuth, no sirve como token) |
| `TRELLO_TOKEN` | **Token de usuario** — obligatorio para crear/editar tarjetas |

## Generar el token (solo una vez)

1. Abre este enlace (usa tu API Key):

```
https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=49c543a3f9c0118209748e97a5edff09
```

2. Autoriza la app — Trello te muestra un **token** largo.
3. Pégalo en `deploy/.env.trello`:

```env
TRELLO_TOKEN=el_token_que_te_dio_trello
```

## Comandos

```bash
cd Restaurante/client-user-restaurant

# Crear/actualizar tarjetas del proyecto
pnpm trello:sync

# O directamente
node deploy/create-trello-cards.mjs
```

## Notas

- El **secreto OAuth** ≠ **token de usuario**. La API REST necesita key + token.
- El script no duplica tarjetas con el mismo nombre en la misma lista.
- Las tarjetas `[Mapas]` se asignan a **jsajche** si está en el board.
