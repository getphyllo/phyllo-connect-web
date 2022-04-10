// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BaseApi } from '../../../repository/api'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiCient = new BaseApi();
  const workPlatforms = await apiCient.getRequest('/work-platforms');
  res.status(200).json({ ...workPlatforms })
}
