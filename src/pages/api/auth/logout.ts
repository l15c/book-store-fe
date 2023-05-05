import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Method not supported' });
  }

  const cookies = new Cookies(req, res);
  cookies.set('auth-token');

  return res.status(200).json({ message: 'Logout successfully' });
};
