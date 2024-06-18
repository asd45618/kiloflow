import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const results = await query("SELECT * FROM users");
    res.status(200).json(results);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ message: error.message });
  }
}
