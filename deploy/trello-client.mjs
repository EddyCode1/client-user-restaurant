import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadTrelloEnv() {
  const envPath = join(__dirname, '.env.trello');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function getTrelloCredentials() {
  loadTrelloEnv();
  const key = process.env.TRELLO_KEY || process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN || process.env.TRELLO_API_TOKEN;
  return { key, token };
}

export async function trelloRequest(path, options = {}) {
  const { key, token } = getTrelloCredentials();
  if (!key || !token) {
    throw new Error(
      'Faltan TRELLO_KEY o TRELLO_TOKEN en deploy/.env.trello\n' +
        'Genera el token en: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=' +
        (key || 'TU_KEY'),
    );
  }

  const auth = `key=${key}&token=${token}`;
  const sep = path.includes('?') ? '&' : '?';
  const url = `https://api.trello.com/1${path}${sep}${auth}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401 && text.includes('invalid key')) {
      throw new Error('API Key inválida. Revisa TRELLO_KEY en deploy/.env.trello');
    }
    if (res.status === 401) {
      throw new Error(
        'Token inválido o faltante. El "secreto OAuth" NO es el token.\n' +
          'Genera TRELLO_TOKEN en deploy/TRELLO.md (enlace de autorización).',
      );
    }
    throw new Error(`${options.method || 'GET'} ${path} → ${res.status}: ${text}`);
  }

  return res.status === 204 ? null : res.json();
}

export const BOARD_SHORT_LINK = 'DeIhDyk9';
export const BOARD_URL = 'https://trello.com/b/DeIhDyk9/gestion-de-restaurante';
