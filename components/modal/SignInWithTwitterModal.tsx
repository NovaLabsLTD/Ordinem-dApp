/* eslint-disable react/no-unescaped-entities */
import { useModal } from "hooks/useModal";
import { useTwitterUser } from "hooks/useTwitterUser";
import { signInWithTwitterFirebase } from "utils/firebaseClient";
import ModalWrapper from "./ModalWrapper";

const SignInWithTwitterModal = () => {
  const { setModal } = useModal();
  const { currentUser: user } = useTwitterUser();

  if (user) return null;

  return (
    <ModalWrapper>
      <div className="text-gray-800">
        <h4>Sign in with twitter</h4>
        <div className="flex gap-3 items-center">
          <button onClick={() => setModal(false)}>No, I'll do it later</button>
          <button
            onClick={async () => {
              await signInWithTwitterFirebase();
              setModal();
            }}
            className="bg-blue-400 text-white rounded-full px-5 py-2"
          >
            Yes, Sign me in
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SignInWithTwitterModal;
