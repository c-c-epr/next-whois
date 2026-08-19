import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  _request: NextApiRequest,
  response: NextApiResponse<{ status: string }>,
) {
  response.status(200).json({ status: "ok" });
}