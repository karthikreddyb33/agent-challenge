// Next.js API route for explain
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000/api/explain';
    const resp = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(200).json(data);
  } else {
    res.status(405).end();
  }
}
