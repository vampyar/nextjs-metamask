// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type AbiData = {
  status?: string;
  message: string;
  // Note: JSON.parse for output
  result?: string;
};

export const revalidate = 60 * 60;

const etherscanUrl = (address: string) =>
  `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`;

// TODO Note: It's method need cover authenticate flow for protections API
export default async function POST(req: NextApiRequest, res: NextApiResponse<AbiData>) {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }
  const client = await fetch(etherscanUrl(address));
  const abi = await client.json();
  if (Number.parseInt(abi.status) === 0) {
    return res.status(400).json(abi);
  }
  res.status(200).json(abi);
}
