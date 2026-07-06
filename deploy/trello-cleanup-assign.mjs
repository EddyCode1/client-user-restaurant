#!/usr/bin/env node
/**
 * Limpia board Trello: archiva listas Spring viejas, asigna tarjetas cliente al equipo.
 */
import { loadTrelloEnv, trelloRequest, BOARD_SHORT_LINK } from './trello-client.mjs';

loadTrelloEnv();

const MEMBERS = {
  eddy: '687948b8c3243efbb5a7c3dd',       // 1dex
  zeta: '68794816700072f236b9af3d',       // jzeta2024452
  kevin: '68794878e559371cf61c18c2',      // kramirez2024399
  oscar: '6896cc3405d8d40202806007',      // osicajau2024318
  jsajche: '698d4f9a1b6a35a97044bbda',    // jsajche2024380
  jztea: '698ffabe407da62510beb377',       // jztea2024452
  pablo: '6879486da8219efc1461ef8f',      // phernandez2024329
};

const ARCHIVE_LISTS = ['Spring 1', 'Spring 2', 'Spring 3', 'Revisión', 'En progreso'];

const ASSIGNMENTS = {
  'Probar flujo nativo Android/iOS': MEMBERS.kevin,
  'Verificar CustomerMenuScreen + useMenuStore': MEMBERS.eddy,
  'Completar OrderTimerBadge + detalle pedido': MEMBERS.oscar,
  'Permisos POST /reservation para CLIENTE': MEMBERS.pablo,
  'Pantallas factura/cupones E2E': MEMBERS.zeta,
  'Actualizar e2e/ADMIN.md para cliente': MEMBERS.jztea,
  'CI: pnpm build:web en PR': MEMBERS.eddy,
  '[Mapas] Plugin react-native-maps + permisos': MEMBERS.jsajche,
  '[Mapas] CustomerMapaGeneralScreen': MEMBERS.jsajche,
  '[Mapas] CustomerRestaurantMapScreen': MEMBERS.jsajche,
  '[Mapas] Rutas OSRM (tipo Waze)': MEMBERS.jsajche,
  '[Mapas] Probar GPS en dispositivo físico': MEMBERS.jsajche,
};

const NEW_CARDS = [
  {
    list: 'Asignadas',
    name: '[Cliente] Flujo completo de pedidos (crear + listar)',
    desc: 'CustomerOrderCreateScreen + CustomerOrdersScreen E2E\nLogin CLIENTE → crear pedido → ver en lista\nRepo: client-user-restaurant',
    member: MEMBERS.oscar,
  },
  {
    list: 'Asignadas',
    name: '[Cliente] Pantalla reservas (listar + crear cuando backend permita)',
    desc: 'CustomerReservationListScreen + CreateScreen\nBackend: coordinar con tarjeta permisos POST /reservation',
    member: MEMBERS.zeta,
  },
  {
    list: 'Asignadas',
    name: '[Cliente] Lista y detalle de restaurantes',
    desc: 'CustomerRestaurantListScreen + navegación a menú/mapa\nVerificar GET /restaurant con JWT',
    member: MEMBERS.kevin,
  },
  {
    list: 'Asignadas',
    name: '[Cliente] RegisterScreen + registro CLIENTE',
    desc: 'Probar POST /auth/register desde app\nValidar que nuevo usuario entra como CLIENTE',
    member: MEMBERS.eddy,
  },
  {
    list: 'Asignadas',
    name: '[Cliente] MenuViewModal — detalle platos/bebidas',
    desc: 'Implementar fetch real en MenuViewModal.jsx\nUsar DishService y beverageService',
    member: MEMBERS.jztea,
  },
  {
    list: 'Backlog',
    name: '[Cliente] Push main + verificar deploy/README para el equipo',
    desc: 'Asegurar que main tiene últimos commits\nCompartir pasos deploy/README-MOBILE.md al equipo',
    member: MEMBERS.jsajche,
  },
];

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
  console.log(`Board: ${board.name}\n`);

  const lists = await trelloRequest(`/boards/${board.id}/lists?fields=name,id,closed`);

  for (const list of lists) {
    if (ARCHIVE_LISTS.includes(list.name) && !list.closed) {
      await trelloRequest(`/lists/${list.id}/closed?value=true`, { method: 'PUT' });
      console.log(`Archivada lista: ${list.name}`);
    }
  }

  const asignadas = lists.find((l) => l.name === 'Asignadas' && !l.closed);
  const backlog = lists.find((l) => l.name === 'Backlog' && !l.closed);
  const porHacer = lists.find((l) => l.name === 'Por hacer' && !l.closed);

  const targetList = asignadas || porHacer;

  const cards = await trelloRequest(
    `/boards/${board.id}/cards?fields=name,id,idList,idMembers`,
  );

  let moved = 0;
  let assigned = 0;

  for (const card of cards) {
    const memberId = ASSIGNMENTS[card.name];
    const isClientCard =
      card.name.startsWith('[Mapas]') ||
      card.name.startsWith('[Cliente]') ||
      ASSIGNMENTS[card.name] ||
      [
        'Probar flujo nativo Android/iOS',
        'Verificar CustomerMenuScreen + useMenuStore',
        'Completar OrderTimerBadge + detalle pedido',
        'Permisos POST /reservation para CLIENTE',
        'Pantallas factura/cupones E2E',
        'Actualizar e2e/ADMIN.md para cliente',
        'CI: pnpm build:web en PR',
      ].includes(card.name);

    if (!isClientCard) continue;

    const isPending =
      porHacer &&
      card.idList === porHacer.id &&
      !card.name.includes('Documentar') &&
      !card.name.startsWith('Crear deploy') &&
      !card.name.startsWith('Script') &&
      !card.name.startsWith('README arranque') &&
      !card.name.startsWith('Seed') &&
      !card.name.startsWith('Fix') &&
      !card.name.startsWith('Docker mobile');

    if (isPending && targetList && card.idList !== targetList.id) {
      await trelloRequest(`/cards/${card.id}?idList=${targetList.id}`, { method: 'PUT' });
      console.log(`Movida → Asignadas: ${card.name}`);
      moved += 1;
    }

    if (memberId) {
      await assignMember(card.id, memberId);
      console.log(`Asignada: ${card.name}`);
      assigned += 1;
    }
  }

  for (const item of NEW_CARDS) {
    const list = lists.find((l) => l.name === item.list && !l.closed);
    if (!list) continue;

    const exists = cards.some((c) => c.name === item.name);
    if (exists) {
      console.log(`= Ya existe: ${item.name}`);
      continue;
    }

    const created = await trelloRequest('/cards', {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
        desc: item.desc,
        idList: list.id,
        pos: 'bottom',
      }),
    });

    if (item.member) {
      await assignMember(created.id, item.member);
    }
    console.log(`+ Nueva: ${item.name}`);
  }

  console.log(`\nListo. Movidas: ${moved}, asignadas: ${assigned}, nuevas: ${NEW_CARDS.length}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
