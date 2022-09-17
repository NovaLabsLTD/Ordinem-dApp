import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { getUserFromAddress, updateUser } from "./firebaseClient";
import { increment } from "firebase/firestore";

export const sendTokensToUser = async (
  to: string,
  amount: number,
  decimals?: number
) => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  const secret = process.env.NEXT_PUBLIC_WALLET_SECRET?.replace(/ /g, "")
    .split(",")
    .map((item) => Number(item));
  const secretKey = Uint8Array.from(secret!);
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.fromSecretKey(secretKey);
  const toWallet = new PublicKey(to);
  const destMint = new PublicKey(
    process.env.NEXT_PUBLIC_MINT_TOKEN_ADDRESS as string
  );

  // Get the token account of the fromWallet address, and if it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    destMint,
    fromWallet.publicKey
  );

  // Get the token account of the toWallet address, and if it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    destMint,
    toWallet
  );

  const user = await getUserFromAddress(to);
  if (user.nftCount) {
    amount += ((user.nftCount - 1) * amount) / 10;
  }
  const transferAmount = amount * 10 ** 8;

  const signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    transferAmount
  );

  updateUser(user._id, {
    tokensEarned: increment(amount),
  });

  return signature;
};
