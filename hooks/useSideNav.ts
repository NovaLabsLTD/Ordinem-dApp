import create from "zustand";

type State = {
  show: boolean;
};

interface StateWithMutation extends State {
  setSideNav: (payload?: boolean) => void;
  open: () => void;
  close: () => void;
}

export const useSideNav = create<StateWithMutation>((set) => ({
  show: false,
  setSideNav: (payload) => {
    set((state) => ({ ...state, show: payload ?? !state.show }));
  },
  open: () => {
    set((state) => ({ ...state, show: true }));
  },
  close: () => {
    set((state) => ({ ...state, show: false }));
  },
}));
