export const getCloudflareImagesFileURL = (_id: string) =>
  `${process.env.CLOUDFLARE_IMAGES_CDN_ADDRESS}/${_id}/public`;
export const getCloudflareR2FileURL = (_id: string) =>
  `${process.env.CLOUDFLARE_R2_CDN_ADDRESS}/${_id}`;
