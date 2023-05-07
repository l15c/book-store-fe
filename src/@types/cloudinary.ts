export type UploadImageResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image';
  created_at: string;
  tags: string[];
  bytes: number;
  type: 'upload';
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
};

export type UploadParams = {
  public_id?: string;
  folder: string;
};

export type RenameParams = {
  from_public_id: string;
  to_public_id: string;
  // signature:string;
  resource_type?: string;
  type?: string;
  to_type?: string;
  overwrite?: boolean;
  invalidate?: boolean;
  context?: boolean;
  metadata?: boolean;
};
