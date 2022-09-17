import create from "zustand";

type State = {
  showModal: boolean;
};

interface StateWithMutation extends State {
  setModal: (payload?: boolean) => void;
}

export const useModal = create<StateWithMutation>((set) => ({
  showModal: false,
  setModal: (payload) => {
    set((state) => ({ ...state, showModal: payload ?? !state.showModal }));
  },
}));