import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-admin-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export class HttpError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export function serveEndpoint(
  handler: (request: Request, client: SupabaseClient) => Promise<unknown>,
) {
  Deno.serve(async (request) => {
    if (request.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      if (request.method !== 'POST') throw new HttpError('Méthode non autorisée.', 405);
      const url = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!url || !serviceRoleKey) throw new Error('Secrets Supabase serveur manquants.');

      const client = createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const body = await handler(request, client);
      return jsonResponse(body, 200);
    } catch (error) {
      if (error instanceof HttpError) return jsonResponse({ error: error.message }, error.status);
      console.error('Erreur Edge Function Supabase:', error);
      return jsonResponse({ error: 'Une erreur serveur est survenue.' }, 500);
    }
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new HttpError('Corps JSON invalide.', 400);
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError('Objet JSON attendu.', 400);
  }
  return value as Record<string, unknown>;
}

export function validateAdminKey(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{48}$/.test(value)) {
    throw new HttpError('Clé administrateur invalide.', 400);
  }
  return value;
}

export async function requireAdmin(client: SupabaseClient, key: string) {
  const { data, error } = await client
    .from('configuration_caisse')
    .select('id, cle_admin')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.cle_admin !== key) {
    throw new HttpError("Seul l'administrateur peut effectuer cette opération.", 403);
  }
  return data;
}

export function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(value: string) {
  const bytes = new Uint8Array(value.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

const PIN_ITERATIONS = 310_000;

export async function hashPin(pin: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const digest = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PIN_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(new Uint8Array(digest));
}

export function createPinSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function saltFromHex(value: string) {
  if (!/^[0-9a-f]{32}$/.test(value)) throw new Error('Invalid PIN salt in database.');
  return fromHex(value);
}

export function hexValue(value: Uint8Array) {
  return toHex(value);
}

export function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function getClientHash(request: Request) {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceRoleKey) throw new Error('Secret Supabase serveur manquant.');

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-real-ip')
    ?? (forwardedFor ? forwardedFor.split(',').at(-1)?.trim() : undefined)
    ?? 'unknown';
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(serviceRoleKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(clientIp));
  return toHex(new Uint8Array(digest));
}
