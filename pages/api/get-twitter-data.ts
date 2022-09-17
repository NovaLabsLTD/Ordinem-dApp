import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER;
const URL = `http://api.twitter.com/1.1/users/show.json`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = req.body.user_id ?? req.query.user_id;
  const screen_name = req.body.screen_name ?? req.query.screen_name;
  const params: any = {};

  if (screen_name) {
    params.screen_name = screen_name;
  }
  if (user_id) {
    params.user_id = user_id;
  }

  if (!user_id && !screen_name) {
    res.json({
      status: "error",
      error: "Enter a valid id or username",
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

    const { screen_name, name, followers_count, friends_count, profile_image_url_https } = result.data;

    res.json({
      status: "ok",
      data: {
        ...result.data,
        followers: followers_count,
        following: friends_count,
        image: profile_image_url_https,
        screen_name,
        name,
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
