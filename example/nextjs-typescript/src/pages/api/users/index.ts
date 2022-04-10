import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../@types/user.type";
import { BaseApi } from "../../../repository/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const apiCient = new BaseApi();
  switch (req.method) {
    case "POST": {
      const { name, externalId } = req.body;
      apiCient
        .postRequest(`/users`, {
          name: name,
          external_id: externalId,
        })
        .then((r) => res.status(200).json({ ...r }))
        .catch((e) => {
            res.status(400).json(e);
        });
      break;
    }
    case "GET": {
      const { externalId } = req.query;
      const user = await apiCient.getRequest(
        `/users/external_id/${externalId}`
      );
      res.status(200).json({ ...user });
    }
  }
}
