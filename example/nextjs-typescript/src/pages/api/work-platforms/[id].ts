import type { NextApiRequest, NextApiResponse } from "next";
import { BaseApi } from "../../../repository/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workPlatformId = req.query.id;
  const apiCient = new BaseApi();
  const workPlatforms = await apiCient.getRequest(
    `/work-platforms/${workPlatformId}`
  );
  res.status(200).json({ ...workPlatforms });
}
