import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const paramsToSign = req.body || {};

  const pSort = Object.keys(paramsToSign)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: paramsToSign[key] }), {});

  const pStr = Object.keys(pSort)
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const signature = crypto
    .createHash('sha1')
    .update(pStr + process.env.CLOUDINARY_API_SECRET!)
    .digest('hex');

  try {
    res.json(signature);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
