import { serveEndpoint } from '../_shared/common.ts';

serveEndpoint(async (_request, client) => {
  const { data, error } = await client
    .from('configuration_caisse')
    .select('configuration, cle_admin')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return { config: data?.configuration ?? null, hasAdmin: Boolean(data?.cle_admin) };
});
