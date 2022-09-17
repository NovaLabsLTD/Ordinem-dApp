/* eslint-disable react/no-unescaped-entities */
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import Spinner from "components/Spinner";
import { arrayUnion, increment, serverTimestamp } from "firebase/firestore";
import { useAlert } from "hooks/useAlert";
import { useNotification } from "hooks/useNotification";
import { useTwitterUser } from "hooks/useTwitterUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { calculateLevels } from "utils/constants";
import {
  getCurrentUserData,
  getRandomUser,
  updateUser,
  updateUserData,
} from "utils/firebaseClient";
import { sendTokensToUser } from "utils/token";
import SuccessPopup from "./SuccessPopup";

let debounceCallback: NodeJS.Timeout;
const Follow = () => {
  const [user, setUser] = useState<any>();
  const [users, setUsers] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isQuotaEnded, setIsQuotaEnded] = useState(false);
  const [error, setError] = useState("");

  const wallet = useAnchorWallet();
  const { currentUser } = useTwitterUser();
  const { openNotification } = useNotification();
  const { open } = useAlert();

  const fetchAndChangeUser = async (firebaseUser: any) => {
    if (!firebaseUser) return;
    console.log(firebaseUser);
    const uid = currentUser?.providerData[0].uid;
    const currentUserData = await getCurrentUserData(uid);
    if (
      currentUserData.followCount >=
      calculateLevels(currentUserData.nftCount ?? 1)
    ) {
      open({
        message: "Follow quota exceeds",
        status: "error",
      });
      setIsQuotaEnded(true);
      return;
    }
    if (firebaseUser.followers && firebaseUser.followers.includes(uid)) {
      updateNewUser();
      return;
    }
    const result = await axios.get(
      `/api/get-twitter-data?user_id=${firebaseUser.uid}`
    );

    setUser({
      ...firebaseUser,
      ...result.data.data,
      image: result.data.data.profile_image_url_https.replace("_normal", ""),
    });
    setIsVerified(false);
  };

  const fetchUsers = async () => {
    if (!wallet || !currentUser) return;

    setIsLoading(true);
    try {
      const random = await getRandomUser(
        wallet?.publicKey.toString(),
        currentUser?.providerData[0].uid
      );
      console.log(random);

      if (random) {
        setUsers([random?.randomUser, ...(random?.users as [])]);
        fetchAndChangeUser(random?.randomUser);
      }
    } catch (error) {
      setError(error as string);
    }
    setIsLoading(false);
  };

  const updateNewUser = () => {
    const user = users[index + 1];
    setIndex((state) => state + 1);
    fetchAndChangeUser(user);
  };

  useEffect(() => {
    clearTimeout(debounceCallback);
    debounceCallback = setTimeout(fetchUsers, 1000);
  }, [wallet]);

  useEffect(() => {
    if (users && users.length && users[index]) {
      const user = users[index];
      setUser(user);
      setIsVerified(false);
    }
  }, [users, index]);

  const verifyUserFollow = async () => {
    if (!isVerifying) {
      setIsVerifying(true);
      try {
        const result = await axios.get(
          `/api/get-twitter-followers?user_id=${user.uid}`
        );
        const currentUserId = currentUser?.providerData[0].uid;

        if (
          result.data.data &&
          result.data.data.ids &&
          result.data.data.ids.includes(Number(currentUserId))
        ) {
          setIsVerified(true);
          updateUser(user._id, {
            followers: arrayUnion(currentUserId),
          });
          updateUserData({
            followCount: increment(1),
            lastFollowed: serverTimestamp(),
          });
          const sig = await sendTokensToUser(
            wallet?.publicKey.toString() as string,
            5
          );

          openNotification(() => (
            <SuccessPopup goldRecieved={5} quest="follow" signature={sig} />
          ));

          updateNewUser();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  if (!wallet) {
    return <div className="">Connect your wallet</div>;
  }

  if (isLoading) return <div>Loading ...</div>;
  if (error.length > 0) return <div>{error}</div>;

  if (user === undefined) return null;

  if (user === null)
    return (
      <div>
        <h5>No User found in the database that has NFT</h5>
      </div>
    );

  if (isQuotaEnded)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center">
        <h4>Quota ended for today</h4>
        <p>Come again tomorrow to take up more follow quests</p>
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center px-4 py-8 my-2 bg-gray-800 h-full rounded-lg">
        <Image
          src={user.image}
          className="rounded-lg"
          alt={user.name ?? user.displayName}
          height={200}
          width={200}
        />
        <h3 className="mt-2">{user.name ?? user.displayName}</h3>

        {user.following && user.followers && (
          <div className="flex items-center gap-4 mt-4">
            <div className="flex flex-col items-center">
              <h6 className="text-xl">{user?.followers}</h6>
              <h5 className="text-gray-400">Followers</h5>
            </div>
            <div className="flex flex-col items-center">
              <h6 className="text-xl">{user?.following}</h6>
              <h5 className="text-gray-400">Followings</h5>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-center mt-6">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://twitter.com/intent/follow?screen_name=${
              user.screen_name ?? user.screenName
            }`}
            className="bg-blue-400 text-white px-5 py-2 rounded-lg"
          >
            Follow @{user.screen_name ?? user.screenName}
          </a>

          {isVerified ? (
            <h4>Verified</h4>
          ) : (
            <button
              onClick={verifyUserFollow}
              className={`bg-gray-50 text-blue-700 px-5 min-w-[5rem] py-2 rounded-lg duration-75 font-semibold ${
                isVerifying && "opacity-60 pointer-events-none"
              }`}
            >
              {isVerifying ? <Spinner /> : "Verify follow"}
            </button>
          )}
        </div>

        {users.length > 0 && index !== users.length - 1 && (
          <button onClick={updateNewUser} className="mt-4">
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default Follow;
