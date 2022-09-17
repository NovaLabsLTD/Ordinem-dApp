/* eslint-disable react/no-unescaped-entities */
import { useSolanaNfts } from "hooks/useSolanaNfts";
import type { NextPage } from "next";
import SignInWithTwitter from "components/buttons/SignInWithTwitter";
import { useTwitterUser } from "hooks/useTwitterUser";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Image from "components/Image";
import NextImage from "next/image";

const Home: NextPage = () => {
  const { nfts } = useSolanaNfts();
  const wallet = useAnchorWallet();

  const renderFullScreenMessage = (message: string) => (
    <div className="h-[80vh] w-full flex justify-center items-center text-center">
      <h5 className="text-3xl">{message}</h5>
    </div>
  );

  return (
    <div>
      {(() => {
        if (!wallet?.publicKey) {
          return renderFullScreenMessage("Connect your wallet");
        } else if (!nfts) {
          return renderFullScreenMessage("Fetching your NFTs...");
        } else if (nfts && nfts.length > 0) {
          return <NftsComponent />;
        } else {
          return renderFullScreenMessage("There's no NFts in your wallet");
        }
      })()}
    </div>
  );
};

const checkIsGif = (image: string) => {
  const dot = image.split(".");
  const equal = image.split("=");
  return equal[1] === "gif" || dot[dot.length - 1] === "gif";
};

const NftsComponent = () => {
  const { nfts, tokens } = useSolanaNfts();
  const { currentUser: user } = useTwitterUser();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
      {nfts &&
        nfts.length > 0 &&
        nfts.map((nft, i) => (
          <div
            key={i}
            className="bg-gray-100 text-black dark:bg-nav-dark-500 dark:text-white rounded-lg px-5 py-3 flex flex-col justify-between"
          >
            <div className="mb-4 flex flex-col items-center">
              {checkIsGif(nft.image) ? (
                <img
                  loading="lazy"
                  className="max-h-80 min-h-[14rem] overflow-hidden rounded-lg h-full object-cover"
                  src={nft.image}
                  alt={nft.name}
                />
              ) : (
                <NextImage
                  className="max-h-72 min-h-[15rem] overflow-hidden rounded-lg h-full object-cover"
                  src={nft.image}
                  alt={nft.name}
                  width={400}
                  height={400}
                />
              )}
              <div className="flex gap-3 items-center mt-2">
                <div className="rounded-full min-w-[6rem] w-1/2 h-2 border border-gray-300">
                  {/* <div className="w-1/2 h-full bg-green-400"></div> */}
                </div>
                <h5 className="text-gray-500">
                  Level{" "}
                  <strong className="text-black dark:text-white">0</strong>
                </h5>
              </div>
            </div>
            <div>
              <h3 className="text-2xl">{nft.name}</h3>

              {user && (
                <div className="flex gap-1 mt-1 mb-3 items-center text-gray-500">
                  <div className="rounded-full h-6 w-6 overflow-hidden">
                    {user.profile_image && (
                      <Image
                        src={user.profile_image}
                        alt={user.displayName as string}
                      />
                    )}
                  </div>
                  {user.screenName && (
                    <div>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.twitter.com/${user.screenName}`}
                      >
                        @{user.screenName}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <h5 className="text-gray-500">
                Tokens Earned:{" "}
                <strong className="text-black dark:text-white">{tokens}</strong> Gold
              </h5>
            </div>

            {!nft.twitter && (
              <div className="none lg:block">
                <SignInWithTwitter />
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
export default Home;
