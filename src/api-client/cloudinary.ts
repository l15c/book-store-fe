import { POST } from './axios';
import { RenameParams, UploadImageResponse, UploadParams } from '../@types/cloudinary';
import { CustomFile } from '../components/upload';

// const {
//   CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_UNSIGNED_PRESET,
//   CLOUDINARY_SIGNED_PRESET,
//   CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET,
// } = ;
export const cloudinaryApi = {
  uploadSign: async (file: CustomFile, options?: UploadParams) => {
    const params = {
      ...options,
      upload_preset: process.env.CLOUDINARY_SIGNED_PRESET,
      timestamp: Date.now(),
    };

    const signature = await POST<typeof params, string>('/cld/sign', params);

    const formData = new FormData();

    formData.set('file', file);
    formData.set('signature', signature);
    formData.set('api_key', process.env.CLOUDINARY_API_KEY!);

    Object.keys(params).forEach((key) => {
      formData.set(key, params[key as keyof typeof params] as string);
    });

    return POST<FormData, UploadImageResponse>('/cld/upload', formData);
  },

  rename: async (data: RenameParams) => {
    console.log(process.env.CLOUDINARY_UNSIGNED_PRESET);

    const params = {
      ...data,
      timestamp: Date.now(),
    };

    type T = keyof typeof params;

    const signature = await POST<typeof params, string>('/cld/sign', params);

    const formData = new FormData();

    formData.set('signature', signature);
    formData.set('api_key', process.env.CLOUDINARY_API_KEY!);

    Object.keys(params).forEach((key) => {
      formData.set(key, params[key as T] as string);
    });

    return POST<FormData, UploadImageResponse>('/cld/rename', formData);
  },
};
