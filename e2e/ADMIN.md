# Pruebas E2E — Validación rol Admin (Manual)

App: `client-user-restaurant` · Contexto: **solo CLIENTE** (no es la app de administración)

> La gestión admin del restaurante vive en `restaurante-frontend` / panel web. Esta app móvil rechaza usuarios ADMIN.

## Prerequisitos

```bash
cd client-user-restaurant
pnpm install
pnpm start:all    # Docker API :3016 + dev build Android
```

| Usuario | Email                   | Password    | Resultado esperado      |
|---------|-------------------------|-------------|-------------------------|
| Admin   | admin@restaurante.com   | Admin1234   | "Acceso denegado"       |
| Cliente | cliente@restaurante.com | Cliente1234 | Entra a MainTabs        |

---

## Checklist

- [ ] Login con `admin@restaurante.com` → alerta "Acceso denegado", no entra
- [ ] Tras rechazo admin, la app sigue en Login (sin token persistido)
- [ ] Sidebar / navbar no muestran branding bancario (logo Omakase)
- [ ] No hay pantallas de banco (depósitos, cuentas, transacciones)
- [ ] Login con CLIENTE funciona y carga MainTabs con pestañas restaurante

---

Reportar: pantalla, acción, mensaje de error o captura.

Ver checklist completo de flujos cliente en [`CLIENT.md`](./CLIENT.md).
