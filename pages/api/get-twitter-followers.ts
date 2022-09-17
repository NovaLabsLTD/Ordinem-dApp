import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER;
const URL = `http://api.twitter.com/1.1/followers/ids.json`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = req.body.user_id ?? req.query.user_id;
  const screen_name = req.body.screen_name ?? req.query.screen_name;
  const params: any = { user_id };

  if(screen_name){
    params.screen_name = screen_name
  }

  if (!user_id || !user_id.trim()) {
    res.json({
      status: "error",
      error: "Enter a valid id",
    });

    return;
  }

  try {
    const result = await axios.get(URL, {
      params,
      headers: {
        authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const { ids } = result.data;

    res.json({
      status: "ok",
      data: {
        ids
      },
    });
  } catch (error: any) {
    console.log(error);
    res.json({
      status: "error",
      data: error.message || "Something went wrong",
    });
  }
};

export default handler;
