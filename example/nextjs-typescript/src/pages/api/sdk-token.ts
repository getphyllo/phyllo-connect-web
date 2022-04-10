import type { NextApiRequest, NextApiResponse } from "next";
import { SdkToken } from "../../@types/auth.type";
import { BaseApi } from "../../repository/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SdkToken>
) {
  const { userId } = req.body;
  const apiCient = new BaseApi();
  const workPlatforms = await apiCient.postRequest("/sdk-tokens", {
    products: ["IDENTITY", "ENGAGEMENT"],
    user_id: userId,
  });
  res.status(200).json({ ...workPlatforms });
}
