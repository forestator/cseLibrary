// Same rule as scripts/migrate-storage/migrate.mjs: Firebase Storage URLs become deterministic Cloudinary URLs.
const OLD_URL = /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/cseh-50966\.appspot\.com\/o\/([^"'\\\s?)]+)(?:\?[^"'\\\s)]*)?/g;
const CLOUD = 'seo9axkp';

const publicIdOf = storagePath => storagePath.replace(/\.[^./]+$/, '').replace(/[?&#%<>\\]/g, '_').replace(/\s+$/, '');

export const rewriteStorageUrls = text =>
  text.replace(OLD_URL, (_, encodedPath) => `https://res.cloudinary.com/${CLOUD}/image/upload/${encodeURI(publicIdOf(decodeURIComponent(encodedPath)))}`);
