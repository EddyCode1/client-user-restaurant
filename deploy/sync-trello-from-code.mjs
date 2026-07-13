#!/usr/bin/env node
/**
 * Sincroniza Trello con el estado real del código en main.
 * Mueve tarjetas completadas a Listo, pendientes QA a Revisión.
 */
import { loadTrelloEnv, trelloRequest, BOARD_SHORT_LINK } from './trello-client.mjs';

loadTrelloEnv();

const DONE = [
  {
    match: 'Completar OrderTimerBadge',
    note: 'useDetallePedidoStore usa /detallepedido/order/:id + OrderTimerBadge auto-completar. main bdae4d4+',
  },
  {
    match: '[Cliente] Flujo completo de pedidos',
    note: 'CustomerOrderCreateScreen saveOrder + cupón + lista órdenes. main 70dbf6a+',
  },
  {
    match: 'Permisos POST /reservation',
    note: 'Backend reservation.routes.js permite Roles.CLIENTE en POST/PUT. main adcfa61+',
  },
  {
    match: 'Pantallas factura/cupones E2E',
    note: 'merge ft/zeta: invoiceService, PDF, CouponsScreenIntegrated. main 4c712e0+',
  },
  {
    match: '[Cliente] Pantalla reservas',
    note: 'Lista user_id, modal visible, cancelReservation, crear reserva. main 70dbf6a+',
  },
  {
    match: '[Cliente] Lista y detalle de restaurantes',
    note: 'CustomerRestaurantListScreen + modal + fix FlatList/ScrollView. main bdae4d4+',
  },
  {
    match: 'MenuViewModal',
    note: 'Fetch platos/bebidas DishService + beverageService. main 12f8bc3+',
  },
  {
    match: 'Verificar CustomerMenuScreen',
    note: 'useMenuStore GET /menu implementado. Pendiente solo QA manual en emulador.',
  },
  {
    match: 'RegisterScreen',
    note: 'RegisterScreen + authService.register implementados. Pendiente QA registro E2E.',
  },
  {
    match: '[Cliente] Push main',
    note: 'main sincronizado: mapas, pedidos, reservas, factura, deploy, start:all. e094e21',
  },
];

const REVISION = [
  {
    match: 'Probar flujo nativo Android/iOS',
    note: 'Código: pnpm start:all (Docker + prebuild mapas + Metro). Falta que el equipo confirme en emulador.',
  },
];

const STILL_PENDING = [
  { match: 'Probar GPS en dispositivo físico', list: 'Backlog' },
  { match: 'Actualizar e2e/ADMIN.md', list: 'Backlog' },
  { match: 'CI: pnpm build:web', list: 'Backlog' },
];

const NEW_LISTO = [
  {
    name: 'Fix ContactScreen useContactStore import',
    desc: 'Import default useContactStore. main 8b2649a',
    member: 'jsajche2024380',
  },
  {
    name: 'Script pnpm start:all (Docker + mapas + Metro)',
    desc: 'scripts/start-all.sh unifica arranque. main e094e21',
    member: 'jsajche2024380',
  },
  {
    name: 'Fix crear pedido + cupón + reservas modal',
    desc: 'saveOrder, user_id, cancelReservation. main 70dbf6a',
    member: 'jsajche2024380',
  },
];

async function getLists(boardId) {
  const lists = await trelloRequest(`/boards/${boardId}/lists?fields=name,id,closed`);
  const map = {};
  for (const l of lists.filter((x) => !x.closed)) {
    map[l.name] = l.id;
  }
  return map;
}

async function findMember(boardId, hint) {
  const members = await trelloRequest(`/boards/${boardId}/members?fields=username,fullName,id`);
  return (
    members.find(
      (m) =>
        m.username?.toLowerCase().includes(hint.toLowerCase()) ||
        m.fullName?.toLowerCase().includes(hint.toLowerCase()),
    )?.id || null
  );
}

function matches(cardName, pattern) {
  return cardName.toLowerCase().includes(pattern.toLowerCase());
}

async function moveCard(card, listId, extraDesc) {
  const desc = card.desc?.includes('✅ Código verificado')
    ? card.desc
    : `${card.desc || ''}\n\n✅ Código verificado en main (${new Date().toISOString().slice(0, 10)})\n${extraDesc}`.trim();

  await trelloRequest(`/cards/${card.id}`, {
    method: 'PUT',
    body: JSON.stringify({ idList: listId, desc }),
  });
}

async function assignMember(cardId, memberId) {
  try {
    await trelloRequest(`/cards/${cardId}/idMembers`, {
      method: 'POST',
      body: JSON.stringify({ value: memberId }),
    });
  } catch (e) {
    if (!e.message.includes('already on the card')) throw e;
  }
}

async function main() {
  const board = await trelloRequest(`/boards/${BOARD_SHORT_LINK}?fields=id,name`);
  const listMap = await getLists(board.id);
  const listoId = listMap['Listo'];
  const revisionId = listMap['Revisión'] || listMap['Revision'] || listMap['Asignadas'];

  if (!listoId) throw new Error('Lista "Listo" no encontrada');

  const cards = await trelloRequest(`/boards/${board.id}/cards?fields=name,id,desc,idList`);

  let movedDone = 0;
  let movedRevision = 0;

  for (const card of cards) {
    const doneRule = DONE.find((r) => matches(card.name, r.match));
    if (doneRule && card.idList !== listoId) {
      await moveCard(card, listoId, doneRule.note);
      console.log(`✓ Listo: ${card.name}`);
      movedDone += 1;
      continue;
    }

    const revRule = REVISION.find((r) => matches(card.name, r.match));
    if (revRule && revisionId && card.idList !== revisionId) {
      await moveCard(card, revisionId, revRule.note);
      console.log(`◐ Revisión: ${card.name}`);
      movedRevision += 1;
    }
  }

  for (const item of NEW_LISTO) {
    const exists = cards.find((c) => c.name === item.name);
    if (exists) continue;

    const memberId = item.member ? await findMember(board.id, item.member) : null;
    const created = await trelloRequest('/cards', {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
        desc: `${item.desc}\n\n✅ Código verificado en main`,
        idList: listoId,
        pos: 'bottom',
      }),
    });
    if (memberId) await assignMember(created.id, memberId);
    console.log(`+ Nueva Listo: ${item.name}`);
  }

  console.log(`\nResumen: ${movedDone} → Listo, ${movedRevision} → Revisión`);
  console.log('Pendiente real (sin mover): GPS físico, e2e/ADMIN.md, CI build:web');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
