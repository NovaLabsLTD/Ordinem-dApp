import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSolanaNfts } from "hooks/useSolanaNfts";
import { useEffect } from "react";
import SolanaClient from "utils/solanaClient";
import { Header } from "../header/Header";
import { Sidenav } from "../sidenav/Sidenav";
import { getAuth } from "firebase/auth";
import { useTwitterUser } from "hooks/useTwitterUser";
import { getUserFromAddress } from "utils/firebaseClient";
import Alert from "components/Alert";
import Notification from "components/Notification";

export const Layout = ({ children }) => {
  const wallet = useAnchorWallet();
  const { setNfts } = useSolanaNfts();
  const { login, logout, changeUser } = useTwitterUser();
  const auth = getAuth();

  useEffect(() => {
    if (wallet && wallet.publicKey) {
      (async () => {
        const publicKey = wallet.publicKey.toString();
        setNfts(null);

        const user = await getUserFromAddress(publicKey);
        if (!user) {
          logout();
        } else {
          changeUser(user.screenName);
        }

        const solanaClient = new SolanaClient();
        await solanaClient.getGoldTokens(publicKey);

        const nfts = await solanaClient.getAllNfts(publicKey);
        setNfts(nfts);
      })();
    }
  }, [wallet]);

  useEffect(() => {
    auth.onAuthStateChanged(async (observer) => {
      if (observer !== null) {
        login(observer);
      }
      // else {
      //   logout();
      // }
    });
  }, []);

  return (
    <>
      <div>
        <Alert />
        <Notification />
        <Sidenav />
        <Header />
        <div className="mx-2 md:mx-4 lg:ml-80 py-4 px-3 md:px-6">
          {children}
        </div>
      </div>
    </>
  );
};
