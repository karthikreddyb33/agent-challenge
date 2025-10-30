// Next.js API route for wallet activity
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { wallet } = req.query;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:3000/api/wallet_activity/${wallet}`;
  const resp = await fetch(backendUrl);
  const data = await resp.json();
  res.status(200).json(data);
}
