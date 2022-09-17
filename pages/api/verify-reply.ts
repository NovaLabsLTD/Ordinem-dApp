import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER;
const URL = `https://api.twitter.com/1.1/statuses/user_timeline.json`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = req.body.user_id ?? req.query.user_id;
  const tweet_id = req.body.tweet_id ?? req.query.tweet_id;
  const params: any = { user_id };

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
    const filtered = result.data.filter(
      (data: any) =>
        data.in_reply_to_status_id_str &&
        data.in_reply_to_status_id_str === tweet_id
    );

    res.json({
      status: "ok",
      data: filtered.length > 0,
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
