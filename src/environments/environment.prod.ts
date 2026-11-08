export const environment = {
  production: true,
  // Never commit a real key: a key shipped in the browser bundle is public anyway, so prefer a backend proxy.
  openAiApiKey: '',
  // Unsigned upload preset configured in the Cloudinary console (Settings > Upload).
  cloudinary: {cloudName: '', uploadPreset: ''}
};
