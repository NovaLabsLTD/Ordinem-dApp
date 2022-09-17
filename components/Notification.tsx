import { useNotification } from "hooks/useNotification";
import React, { useEffect } from "react";

let debounced: NodeJS.Timeout;
const Notification = () => {
  const { show, closeNotification, component, position, timer } =
    useNotification();

  useEffect(() => {
    if (show) {
      clearTimeout(debounced);
      debounced = setTimeout(closeNotification, timer);
    }
  }, [show]);

  return (
    <div
      style={{
        zIndex: 100,
      }}
      className={`fixed max-w-lg px-4 py-3 transform-gpu rounded-lg duration-150
      ${
        position === "bottom-right" &&
        `bottom-8 right-0 ${show ? "translate-x-0" : "translate-x-20"}`
      }
       ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative">
        <svg
          onClick={closeNotification}
          className="w-6 h-6 absolute -top-8 -right-2 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        {component()}
      </div>
    </div>
  );
};

export default Notification;
