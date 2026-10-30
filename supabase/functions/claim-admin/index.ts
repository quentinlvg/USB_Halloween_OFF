import { HttpError, readJson, serveEndpoint, validateAdminKey } from '../_shared/common.ts';

serveEndpoint(async (request, client) => {
  const body = await readJson(request);
  const key = validateAdminKey(body.key);
  const { data, error } = await client.rpc('claim_admin', { p_key: key });
  if (error) throw error;
  if (typeof data !== 'boolean') throw new HttpError('Réponse invalide de la base de données.', 500);
  return { isAdmin: data };
});
