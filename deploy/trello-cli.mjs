#!/usr/bin/env node
/**
 * CLI Trello — Gestión de Restaurante
 *
 * Uso:
 *   node deploy/trello-cli.mjs sync          # crear tarjetas del proyecto
 *   node deploy/trello-cli.mjs lists         # ver listas del board
 *   node deploy/trello-cli.mjs cards [lista] # ver tarjetas (opcional filtrar por lista)
 */

import { trelloRequest, BOARD_SHORT_LINK, BOARD_URL, getTrelloCredentials, loadTrelloEnv } from './trello-client.mjs';

loadTrelloEnv();

const [,, command, arg] = process.argv;

async function cmdLists() {
  const board = await trelloRequest(`/boards/${BOARD_SHORT_LINK}?fields=name,url`);
  console.log(`Board: ${board.name}\n${board.url}\n`);
  const lists = await trelloRequest(`/boards/${board.id}/lists?fields=name,id`);
  for (const l of lists) {
    console.log(`- ${l.name} (${l.id})`);
  }
}

async function cmdCards() {
  const board = await trelloRequest(`/boards/${BOARD_SHORT_LINK}?fields=id,name`);
  const lists = await trelloRequest(`/boards/${board.id}/lists?fields=name,id`);
  const filter = arg?.toLowerCase();

  for (const list of lists) {
    if (filter && !list.name.toLowerCase().includes(filter)) continue;
    const cards = await trelloRequest(`/lists/${list.id}/cards?fields=name,url,idMembers`);
    console.log(`\n## ${list.name}`);
    for (const c of cards) {
      console.log(`  - ${c.name}`);
    }
  }
}

async function cmdSync() {
  const { spawn } = await import('child_process');
  const { fileURLToPath } = await import('url');
  const { dirname, join } = await import('path');
  const dir = dirname(fileURLToPath(import.meta.url));
  await new Promise((resolve, reject) => {
    const child = spawn('node', [join(dir, 'create-trello-cards.mjs')], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`sync exit ${code}`))));
  });
}

async function main() {
  const { key, token } = getTrelloCredentials();
  if (!key) {
    console.error('Configura deploy/.env.trello — ver deploy/TRELLO.md');
    process.exit(1);
  }
  if (!token && command !== 'help') {
    console.error('Falta TRELLO_TOKEN en deploy/.env.trello');
    console.error('Genera el token: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=' + key);
    process.exit(1);
  }

  switch (command) {
    case 'sync':
      await cmdSync();
      break;
    case 'lists':
      await cmdLists();
      break;
    case 'cards':
      await cmdCards();
      break;
    default:
      console.log(`Trello CLI — ${BOARD_URL}\n`);
      console.log('Comandos:');
      console.log('  sync   Crear tarjetas del proyecto');
      console.log('  lists  Listar columnas del board');
      console.log('  cards [filtro]  Ver tarjetas');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
