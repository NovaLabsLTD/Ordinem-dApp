import Spinner from "components/Spinner";
import { FC, useState } from "react";

interface ButtonProps {
  onClick: () => Promise<void>;
  className?: string;
  text: string
}

const LoadingButton: FC<ButtonProps> = ({ onClick, className, text }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!isVerifying) {
          setIsVerifying(true);
          await onClick();
          setIsVerifying(false);
        }
      }}
      className={`bg-gray-50 text-blue-700 px-5 min-w-[5rem] py-2 rounded-lg duration-75 font-semibold ${className} ${
        isVerifying && "opacity-60 pointer-events-none"
      }`}
    >
      {isVerifying ? <Spinner /> : text}
    </button>
  );
};


export default LoadingButton