import create from "zustand";

type State = {
  width: number;
  height: number;
};

interface StateWithMutation extends State {
  setSize: (payload?: State) => void;
}

export const useWindowSize = create<StateWithMutation>((set) => ({
  width: 0,
  height: 0,
  setSize: (payload) => {
    set((state) => ({ ...state, ...payload }));
  },
}));
