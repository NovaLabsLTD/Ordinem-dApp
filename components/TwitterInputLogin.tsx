import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { addDoc } from "firebase/firestore";
import { useAlert } from "hooks/useAlert";
import { useTwitterUser } from "hooks/useTwitterUser";
import {
  getUserData,
  getUserFromAddress,
  userCollection,
} from "utils/firebaseClient";

const TwitterInputLogin = () => {
  const wallet = useAnchorWallet();
  const { open } = useAlert();
  const { login, currentUser } = useTwitterUser();

  const twitterInputLogin = async (value?: string) => {
    if (!wallet) {
      open({
        message: "Connect to your wallet",
        status: "error",
      });
      return;
    }
    if (!value || value.length < 3) {
      open({
        message: "Enter your username on the input",
        status: "error",
      });
      return;
    }
    if (value[0] !== "@") {
      open({
        message: "Enter your username with @ symbol notation",
        status: "error",
      });
      return;
    }
    value = value.replace("@", "");
    const address = wallet.publicKey.toString();
    const twitterAcnt = await axios.get(
      `/api/get-twitter-data?screen_name=${value}`
    );
    const {
      id_str: uid,
      screen_name: screenName,
      name: displayName,
      image,
    } = twitterAcnt.data.data;
    const user = await getUserFromAddress(address);
    if (user && user.uid !== uid) {
      open({
        message: "Wallet is not authorized for this account",
        status: "error",
      });
      return;
    }

    const firebaseUser = await getUserData(uid);
    if (firebaseUser && firebaseUser.wallet !== address) {
      open({
        message: "This account uses a different wallet",
        status: "error",
      });
      return;
    }

    await addDoc(userCollection, {
      uid,
      image,
      displayName,
      screenName,
      wallet: address ?? "",
      hasNfts: false,
    });

    login({
      displayName,
      photoURL: image,
      reloadUserInfo: {
        screenName,
      },
      providerData: [
        {
          uid,
        },
      ],
    } as any);
  };

  if (currentUser) return null;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await twitterInputLogin(e.currentTarget.querySelector("input")?.value);
      }}
      className="flex gap-3 items-center mx-2"
    >
      <input
        type="text"
        className="bg-gray-200 rounded-lg text-gray-900 px-5 py-2"
        placeholder="username"
      />
      <button>Continue</button>
    </form>
  );
};

export default TwitterInputLogin;
