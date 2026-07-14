# CI — build web (manual hasta scope workflow en PAT)

GitHub rechaza subir `.github/workflows/` con un PAT que solo tiene scope `repo`.
Hasta que regeneres el token con **`workflow`**, usa validación local:

```bash
pnpm ci:web
```

## Crear workflow en GitHub (una vez)

1. Repo → **Actions** → **New workflow** → **set up a workflow yourself**
2. Nombre: `build-web.yml`
3. Pega el contenido de `deploy/templates/build-web.yml`
4. Commit en `main`

O regenera PAT en [github.com/settings/tokens](https://github.com/settings/tokens) con scopes **`repo`** + **`workflow`** y ejecuta:

```bash
git add .github/workflows/build-web.yml
git push origin main
```
