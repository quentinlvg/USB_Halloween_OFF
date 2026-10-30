import { HttpError, readJson, requireAdmin, serveEndpoint, validateAdminKey } from '../_shared/common.ts';

serveEndpoint(async (request, client) => {
  const body = await readJson(request);
  const key = validateAdminKey(body.key);
  if (typeof body.config !== 'string' || body.config.length > 500_000) {
    throw new HttpError('Configuration invalide ou trop volumineuse.', 400);
  }
  try {
    JSON.parse(body.config);
  } catch {
    throw new HttpError('La configuration doit être un JSON valide.', 400);
  }

  await requireAdmin(client, key);
  const { error } = await client
    .from('configuration_caisse')
    .update({ configuration: body.config })
    .eq('id', 1);
  if (error) throw error;
  return { ok: true };
});
