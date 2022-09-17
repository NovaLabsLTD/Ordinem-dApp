import { Close } from "../../icons/close";
import { WalletConnect } from "../../icons/connectWallet";
import { Metamask } from "../../icons/metamask";
import { Phanthom } from "../../icons/phantom";

export const ConnectWallet = ({ open, onClose }) => {
  if (open) {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-nav-dark-500 rounded-2xl">
          <div className="flex rounded-xl">
            <div className="bg-gradient-to-br from-light-background-400 to-light-background-800 dark:from-[#DD0E23] dark:to-[#270318] rounded-l-2xl p-4">
              {/* Header left */}
              <h3 className="text-2xl font-bold">Get Started</h3>
              <h4 className="text-base">Connect Wallet</h4>
              <p className="max-w-xs mt-2 text-sm">
                Connecting your wallet is like “logging in” to Web3. Select your
                wallet from the options to get started.
              </p>
              {/* <Stepper /> */}
            </div>
            <div className="bg-white rounded-r-2xl dark:bg-[#DD0E23]">
              <div className="flex items-center justify-between px-4 py-2">
                {/* Header Right*/}
                <h3>Available Wallets</h3>

                <button onClick={onClose}>
                  <Close />
                </button>
              </div>
              {/* divider */}
              <div className=""></div>
              {/* Wallets */}
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Phantom */}
                <button className="flex items-center p-2 border border-gray-400 rounded-2xl w-52">
                  <div className="p-2 border border-gray-400 rounded-2xl">
                    <Phanthom className="w-10 h-10" />
                  </div>
                  <div className="mx-2 font-bold">Phantom</div>
                </button>
                {/* Wallet Connect */}
                <button className="flex items-center p-2 border border-gray-400 rounded-2xl w-52">
                  <div className="p-2 border border-gray-400 rounded-2xl">
                    <WalletConnect className="w-10 h-10" />
                  </div>
                  <div className="mx-2 font-bold">Wallet Connect</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};
