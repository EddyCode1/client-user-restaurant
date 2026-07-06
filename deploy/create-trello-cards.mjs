#!/usr/bin/env node
/**
 * Crea tarjetas en el board de Trello del proyecto restaurante.
 * Credenciales: deploy/.env.trello (ver deploy/TRELLO.md)
 */

import { trelloRequest, BOARD_SHORT_LINK, BOARD_URL, getTrelloCredentials, loadTrelloEnv } from './trello-client.mjs';

loadTrelloEnv();

const { key: KEY, token: TOKEN } = getTrelloCredentials();

if (!KEY || !TOKEN) {
  console.error('Faltan TRELLO_KEY o TRELLO_TOKEN en deploy/.env.trello');
  console.error('Ver deploy/TRELLO.md para generar el token de usuario.');
  process.exit(1);
}

async function trello(path, options = {}) {
  return trelloRequest(path, options);
}

const LIST_NAMES = ['Backlog', 'Por hacer', 'En progreso', 'Revisión', 'Listo'];

const CARDS = [
  // Infra — Listo
  { list: 'Listo', name: 'Crear deploy/docker-compose.yml', desc: 'Mongo + API + mobile web en client-user-restaurant/deploy/' },
  { list: 'Listo', name: 'Script start:all en backend', desc: 'Gesti-n-de-Restaurante: docker compose up -d && pnpm dev' },
  { list: 'Listo', name: 'README arranque nativo + troubleshooting', desc: 'README-MOBILE.md y deploy/README.md' },
  { list: 'Listo', name: 'Seed usuario CLIENTE + menús demo', desc: 'cliente@restaurante.com / Cliente1234 + Omakase Demo' },

  // MVP cliente — Listo
  { list: 'Listo', name: 'Fix babel-preset-expo + commit', desc: 'Build web y native prebuild OK' },
  { list: 'Listo', name: 'Fix detallePedidoService circular', desc: 'Servicio REST /detalle-pedido implementado' },
  { list: 'Listo', name: 'Fix auth: errores visibles + rol antes de login', desc: 'Solo CLIENTE entra a la app' },

  // MVP cliente — Por hacer
  { list: 'Por hacer', name: 'Probar flujo nativo Android/iOS', desc: 'pnpm prebuild && pnpm run:android\nLogin: cliente@restaurante.com / Cliente1234\n→ pestaña Menú', labels: ['Equipo móvil'] },
  { list: 'Por hacer', name: 'Verificar CustomerMenuScreen + useMenuStore', desc: 'GET /menu con JWT debe listar menús demo', labels: ['Equipo móvil'] },

  // Órdenes & reservas
  { list: 'Por hacer', name: 'Completar OrderTimerBadge + detalle pedido', desc: 'useDetallePedidoStore + OrderTimerBadge E2E', labels: ['Integrante A'] },
  { list: 'Por hacer', name: 'Permisos POST /reservation para CLIENTE', desc: 'Backend: permitir crear reservas a rol CLIENTE', labels: ['Integrante B'] },
  { list: 'Backlog', name: 'Pantallas factura/cupones E2E', desc: 'CustomerFacturaScreen + CouponsScreen', labels: ['Integrante A'] },

  // Mapas — jsajche
  { list: 'Por hacer', name: '[Mapas] Plugin react-native-maps + permisos', desc: 'app.json + Google Maps API key si aplica\nAsignado: jsajche-2024380', memberHint: 'jsajche' },
  { list: 'Por hacer', name: '[Mapas] CustomerMapaGeneralScreen', desc: 'Geolocalización + marcadores restaurantes\nVer docs/MAPAS.md\nAsignado: jsajche-2024380', memberHint: 'jsajche' },
  { list: 'Por hacer', name: '[Mapas] CustomerRestaurantMapScreen', desc: 'Mapa por restaurante con lat/lng del backend\nAsignado: jsajche-2024380', memberHint: 'jsajche' },
  { list: 'Backlog', name: '[Mapas] Rutas OSRM (tipo Waze)', desc: 'Polyline + distancia/tiempo\nReutilizar lógica frontend web si existe\nAsignado: jsajche-2024380', memberHint: 'jsajche' },
  { list: 'Backlog', name: '[Mapas] Probar GPS en dispositivo físico', desc: 'Android/iOS con ubicación real\nAsignado: jsajche-2024380', memberHint: 'jsajche' },
  { list: 'Listo', name: '[Mapas] Documentar web vs nativo', desc: 'MapViewCompat placeholder web\nVer docs/MAPAS.md\nAsignado: jsajche-2024380', memberHint: 'jsajche' },

  // Deploy & QA
  { list: 'Listo', name: 'Docker mobile con EXPO_PUBLIC_* build-args', desc: 'Dockerfile multi-stage en client-user-restaurant' },
  { list: 'Backlog', name: 'Actualizar e2e/ADMIN.md para cliente', desc: 'Reemplazar checklist bancario por flujo restaurante' },
  { list: 'Backlog', name: 'CI: pnpm build:web en PR', desc: 'GitHub Actions o similar' },
];

async function getOrCreateLists(boardId) {
  const existing = await trello(`/boards/${boardId}/lists?fields=name,id`);
  const map = {};
  for (const name of LIST_NAMES) {
    const found = existing.find((l) => l.name === name);
    if (found) {
      map[name] = found.id;
    } else {
      const created = await trello('/lists', {
        method: 'POST',
        body: JSON.stringify({ name, idBoard: boardId }),
      });
      map[name] = created.id;
      console.log(`+ Lista creada: ${name}`);
    }
  }
  return map;
}

async function findMember(boardId, hint) {
  const members = await trello(`/boards/${boardId}/members?fields=username,fullName,id`);
  const match = members.find(
    (m) =>
      m.username?.toLowerCase().includes(hint.toLowerCase()) ||
      m.fullName?.toLowerCase().includes(hint.toLowerCase()),
  );
  return match?.id || null;
}

async function cardExists(listId, name) {
  const cards = await trello(`/lists/${listId}/cards?fields=name`);
  return cards.some((c) => c.name === name);
}

async function main() {
  console.log(`Board: ${BOARD_URL}\n`);

  const board = await trello(`/boards/${BOARD_SHORT_LINK}?fields=id,name,url`);
  console.log(`Conectado: ${board.name} (${board.url})\n`);

  const listMap = await getOrCreateLists(board.id);
  const jsajcheId = await findMember(board.id, 'jsajche2024380') || await findMember(board.id, 'jsajche');

  let created = 0;
  let skipped = 0;

  for (const card of CARDS) {
    const listId = listMap[card.list];
    if (!listId) {
      console.warn(`! Lista no encontrada: ${card.list}`);
      continue;
    }

    if (await cardExists(listId, card.name)) {
      console.log(`= Ya existe: ${card.name}`);
      skipped += 1;
      continue;
    }

    const body = {
      name: card.name,
      desc: card.desc,
      idList: listId,
      pos: 'bottom',
    };

    if (card.memberHint === 'jsajche' && jsajcheId) {
      body.idMembers = [jsajcheId];
    }

    await trello('/cards', { method: 'POST', body: JSON.stringify(body) });
    console.log(`+ ${card.list}: ${card.name}`);
    created += 1;
  }

  console.log(`\nListo. Creadas: ${created}, omitidas (duplicadas): ${skipped}`);
  if (!jsajcheId) {
    console.log('Nota: no se encontró miembro "jsajche" en el board — asigna mapas manualmente.');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
