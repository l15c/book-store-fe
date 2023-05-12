module.exports = {
  swcMinify: false,
  staticPageGenerationTimeout: 1000,
  // trailingSlash: true,
  env: {
    CLOUDINARY_API_KEY: 459472291656744,
    CLOUDINARY_SIGNED_PRESET: 'bookstore_sign',
    CLOUDINARY_UNSIGNED_PRESET: 'img_upload_unsigned',
  },
  images: {
    domains: ['cdn0.fahasa.com'],
  },
};
