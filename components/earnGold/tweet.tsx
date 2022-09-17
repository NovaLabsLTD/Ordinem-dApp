import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { arrayUnion, increment, serverTimestamp } from "firebase/firestore";
import { useAlert } from "hooks/useAlert";
import { useNotification } from "hooks/useNotification";
import { useTwitterUser } from "hooks/useTwitterUser";
import { useEffect, useState } from "react";
import { calculateLevels } from "utils/constants";
import {
  getCurrentUserData,
  getRandomTweet,
  updateUserData,
} from "utils/firebaseClient";
import { sendTokensToUser } from "utils/token";
import LoadingButton from "./LoadingButton";
import SuccessPopup from "./SuccessPopup";
import { Tweet as TweetWidget } from "react-twitter-widgets";

type Quotas = ("Likes" | "Reply" | "")[];

const Tweet = () => {
  const [tweet, setTweet] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTweetLoading, setIsTweetLoading] = useState(true);
  const [loadTweet, setLoadTweet] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const [endedQuotas, setEndedQuotas] = useState<Quotas>([]);
  const [isVerified, setIsVerified] = useState({
    like: false,
    comment: false,
    retweet: false,
  });

  const { currentUser } = useTwitterUser();
  const wallet = useAnchorWallet();
  const { openNotification } = useNotification();
  const { open } = useAlert();

  const fetchAndChangeTweet = async () => {
    const index = Math.ceil(Math.random() * users.length) - 1;
    const _user = users[index];

    if (!_user) return;
    const currentUserId = currentUser?.providerData[0].uid;
    const currentUserData = await getCurrentUserData(currentUserId);
    const level = calculateLevels(currentUserData.nftCount ?? 1);
    const quotas: Quotas = [];
    if (currentUserData.likeCount >= level) {
      quotas.push("Likes");
      open({
        message: "Like quota exceeded",
        status: "error",
      });
      setEndedQuotas(quotas);
      return;
    }
    if (currentUserData.replyCount >= level) {
      quotas.push("Reply");
      open({
        message: "Reply quota exceeded",
        status: "error",
      });
      setEndedQuotas(quotas);
      return;
    }

    const result = await axios.get(
      `/api/get-twitter-random-tweet?user_id=${_user.uid}`
    );
    const tweetData = result.data.data;
    const likeVerify = await axios.get(
      `/api/verify-like?user_id=${currentUserId}&tweet_id=${tweetData.id_str}`
    );
    if (likeVerify.data.data) {
      fetchAndChangeTweet();
      return;
    }

    const replyVerify = await axios.get(
      `/api/verify-reply?user_id=${currentUserId}&tweet_id=${tweetData.id_str}`
    );
    if (replyVerify.data.data) {
      fetchAndChangeTweet();
      return;
    }

    if (result.data.data) {
      setTweet(tweetData);
      setIsVerified({ like: false, comment: false, retweet: false });
      setEndedQuotas(quotas);
      setLoadTweet(true);
    } else {
      fetchAndChangeTweet();
    }
  };

  useEffect(() => {
    if (wallet && currentUser) {
      (async () => {
        setIsLoading(true);
        const random = await getRandomTweet(
          wallet?.publicKey.toString(),
          currentUser?.providerData[0].uid
        );

        if (random) {
          setTweet(random?.tweet);
          setEndedQuotas(random?.quotas);
          setUsers(random.users);
        }
        setIsLoading(false);
      })();
    }
  }, [wallet]);

  const sendTokens = async (quest: string, amount?: number) => {
    const sig = await sendTokensToUser(
      wallet?.publicKey.toString() as string,
      amount ?? 5
    );

    openNotification(() => (
      <SuccessPopup goldRecieved={amount ?? 5} quest={quest} signature={sig} />
    ));
  };

  const verifyLike = async () => {
    try {
      const currentUserId = currentUser?.providerData[0].uid;
      const result = await axios.get(
        `/api/verify-like?user_id=${currentUserId}&tweet_id=${tweet.id_str}`
      );

      if (result.data.data === true) {
        setIsVerified((state) => ({ ...state, like: true }));
        updateUserData({
          likes: arrayUnion(tweet.id_str),
          likeCount: increment(1),
          lastLiked: serverTimestamp(),
        });

        sendTokens("like", 5);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyReply = async () => {
    try {
      const currentUserId = currentUser?.providerData[0].uid;
      const result = await axios.get(
        `/api/verify-reply?user_id=${currentUserId}&tweet_id=${tweet.id_str}`
      );

      if (result.data.data === true) {
        setIsVerified((state) => ({ ...state, comment: true }));
        updateUserData({
          replies: arrayUnion(tweet.id_str),
          replyCount: increment(1),
          lastReplied: serverTimestamp(),
        });

        sendTokens("reply", 10);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!wallet) {
    return <div className="">Connect your wallet</div>;
  }

  if (isLoading) return <div>Loading ...</div>;

  if (tweet === undefined) return null;

  if (tweet === null)
    return (
      <div>
        <h5>No User found in the database that has NFT</h5>
      </div>
    );

  return (
    <>
      <div>
        <TweetWidget
          tweetId={tweet?.id_str}
          onLoad={() => {
            setIsTweetLoading(false);
            setLoadTweet(false);
          }}
        />
        {loadTweet && (
          <div className="min-h-[10rem] w-full flex items-center justify-center text-center">
            <h5 className="text-2xl">Loading tweet...</h5>
          </div>
        )}
        {!isTweetLoading && (
          <div className="flex gap-4">
            {!endedQuotas.includes("Likes") && (
              <div>
                {isVerified.like ? (
                  "Like verified"
                ) : (
                  <LoadingButton text="Verify Like" onClick={verifyLike} />
                )}
              </div>
            )}
            {!endedQuotas.includes("Reply") && (
              <div>
                {isVerified.comment ? (
                  "Reply verified"
                ) : (
                  <LoadingButton text="Verify Comment" onClick={verifyReply} />
                )}
              </div>
            )}
            <LoadingButton text="Next" onClick={fetchAndChangeTweet} />
          </div>
        )}
      </div>
    </>
  );
};

export default Tweet;
