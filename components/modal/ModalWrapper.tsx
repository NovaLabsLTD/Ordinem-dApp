import { useModal } from "hooks/useModal";

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showModal, setModal } = useModal();

  if (!showModal) return <></>;
  return (
    <>
      <div
        onClick={() => setModal(false)}
        style={{
          zIndex: 1000,
        }}
        className="fixed top-0 left-0 bg-black bg-opacity-50 w-full h-screen"
      ></div>
      <div
        style={{
          zIndex: 1001,
        }}
        className="fixed w-full max-w-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {children}
      </div>
    </>
  );
};

export default ModalWrapper;
