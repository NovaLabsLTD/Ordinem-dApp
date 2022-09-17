import React from "react";
import Spinner from "./Spinner";

const Button = ({
  isLoading = false,
  children,
  onClick,
}: {
  isLoading?: boolean;
  children: React.ReactNode | React.ReactChild[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    onClick={onClick}
    className={`bg-blue-400 px-5 py-2 rounded-lg text-white ${
      isLoading && "bg-opacity-40 pointer-events-none"
    }`}
  >
    {isLoading ? <Spinner /> : children}
  </button>
);

export default Button;
