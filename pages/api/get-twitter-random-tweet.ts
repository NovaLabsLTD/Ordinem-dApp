import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER;
const URL = `https://api.twitter.com/1.1/statuses/user_timeline.json`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = req.body.user_id ?? req.query.user_id;
  const screen_name = req.body.screen_name ?? req.query.screen_name;
  const params: any = { user_id };

  if (screen_name) {
    params.screen_name = screen_name;
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
    const filtered = result.data.filter(
      (data: any) =>
        data.text[0] + data.text[1] !== "RT" && !data.in_reply_to_screen_name
    );
    const index = Math.ceil(Math.random() * filtered.length) - 1;
 
    res.json({
      status: "ok",
      data: filtered[index],
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
