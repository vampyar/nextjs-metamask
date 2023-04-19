import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/env.mjs';
import { INewItem } from '@/types/intrefaces';

export const revalidate = 60 * 60;

// TODO Note: It's method need cover authenticate flow for protections API
export default async function GET(req: NextApiRequest, res: NextApiResponse<INewItem[]>) {
  const client = await fetch('https://crypto-news16.p.rapidapi.com/news/top/20', {
    headers: {
      'X-RapidAPI-Key': env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com',
    },
  });
  const result = await client.json();
  res.status(200).json(result);
}
