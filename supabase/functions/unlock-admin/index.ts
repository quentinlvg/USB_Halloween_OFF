import {
  constantTimeEqual,
  getClientHash,
  hashPin,
  HttpError,
  readJson,
  saltFromHex,
  serveEndpoint,
} from '../_shared/common.ts';

serveEndpoint(async (request, client) => {
  const body = await readJson(request);
  if (typeof body.pin !== 'string' || body.pin.trim().length > 12) {
    throw new HttpError('Code administrateur invalide.', 400);
  }
  const clientHash = await getClientHash(request);
  const { data: allowed, error: limitError } = await client.rpc(
    'consume_admin_pin_attempt',
    { p_client_hash: clientHash },
  );
  if (limitError) throw limitError;
  if (allowed !== true) throw new HttpError('Trop de tentatives. Réessaie dans 15 minutes.', 429);

  const { data, error } = await client
    .from('configuration_caisse')
    .select('cle_admin, code_admin_salt, code_admin_hash')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.cle_admin || !data.code_admin_salt || !data.code_admin_hash) {
    throw new HttpError("Aucun code administrateur n'a encore été défini.", 400);
  }

  const actualHash = await hashPin(body.pin.trim(), saltFromHex(data.code_admin_salt));
  if (!constantTimeEqual(actualHash, data.code_admin_hash)) {
    throw new HttpError('Code incorrect.', 401);
  }

  const { error: resetError } = await client.rpc(
    'reset_admin_pin_attempt',
    { p_client_hash: clientHash },
  );
  if (resetError) throw resetError;
  return { key: data.cle_admin };
});
