export const SOLANA_API_KEY = process.env.NEXT_PUBLIC_MORALIS_SOLANA_API_KEY;
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK ?? "devnet";
export const calculateLevels = (nftCount: number) => {
  switch (nftCount) {
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
    case 4:
    case 5:
      return 5;
    case 6:
    case 7:
    case 8:
    case 9:
      return 7;
    default:
      return 10;
  }
};
