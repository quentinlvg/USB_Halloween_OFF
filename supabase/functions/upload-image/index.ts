import { HttpError, requireAdmin, serveEndpoint, validateAdminKey } from '../_shared/common.ts';

const contentTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

serveEndpoint(async (request, client) => {
  const key = validateAdminKey(request.headers.get('x-admin-key'));
  await requireAdmin(client, key);

  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ?? '';
  const extension = contentTypes[contentType];
  if (!extension) throw new HttpError('Format d’image non pris en charge.', 415);
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_SIZE) {
    throw new HttpError('L’image ne peut pas dépasser 5 Mo.', 413);
  }

  const image = new Uint8Array(await request.arrayBuffer());
  if (image.length === 0 || image.length > MAX_IMAGE_SIZE) {
    throw new HttpError('L’image doit peser entre 1 octet et 5 Mo.', 413);
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage
    .from('caisse-images')
    .upload(path, image, { contentType, cacheControl: '31536000', upsert: false });
  if (error) throw error;

  const { data } = client.storage.from('caisse-images').getPublicUrl(path);
  return { url: data.publicUrl };
});
