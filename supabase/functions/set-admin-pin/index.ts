import {
  createPinSalt,
  hashPin,
  hexValue,
  HttpError,
  readJson,
  requireAdmin,
  serveEndpoint,
  validateAdminKey,
} from '../_shared/common.ts';

serveEndpoint(async (request, client) => {
  const body = await readJson(request);
  const key = validateAdminKey(body.key);
  if (typeof body.pin !== 'string' || body.pin.trim().length < 4 || body.pin.trim().length > 12) {
    throw new HttpError('Le code doit contenir entre 4 et 12 caractères.', 400);
  }

  await requireAdmin(client, key);
  const salt = createPinSalt();
  const { error } = await client
    .from('configuration_caisse')
    .update({
      code_admin_salt: hexValue(salt),
      code_admin_hash: await hashPin(body.pin.trim(), salt),
    })
    .eq('id', 1);
  if (error) throw error;
  return { ok: true };
});
