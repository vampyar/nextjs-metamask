import type { NextApiRequest, NextApiResponse } from 'next';

type AbiData = {
  status?: string;
  message: string;
  // Note: JSON.parse for output
  result?: string;
};

export const revalidate = 60 * 60;

// TODO Note: It's method need cover authenticate flow for protections API
export default async function POST(req: NextApiRequest, res: NextApiResponse<AbiData>) {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }
  const client = await fetch('https://crypto-news16.p.rapidapi.com/news/top/20', {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com',
    },
  });
  const abi = await client.json();
  if (Number.parseInt(abi.status) === 0) {
    return res.status(400).json(abi);
  }
  res.status(200).json(abi);
}
