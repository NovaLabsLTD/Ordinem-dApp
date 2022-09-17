import React from "react";

interface Props {
  goldRecieved: number;
  quest: string;
  signature: string;
}

const SuccessPopup: React.FC<Props> = ({ goldRecieved, quest, signature }) => {
  return (
    <div className="bg-gray-800 border-2 items-center border-white px-5 py-3 rounded-lg flex gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Congratulations! 🎉</h2>
        <h4 className="text-gray-300">
          You have received {goldRecieved} Gold for completing the {quest}{" "}
          quest.
        </h4>
        <a
          className="text-gray-700 bg-white rounded-lg px-5 py-3 mt-4 inline-flex"
          href={`https://solscan.io/tx/${signature}`}
          target="_blank"
          rel="noreferrer"
        >
          Go to this url to check the transaction
        </a>
      </div>
      <img src="/gold_pile_rewards.png" alt="Reward gold tokens" />
    </div>
  );
};

export default SuccessPopup;
