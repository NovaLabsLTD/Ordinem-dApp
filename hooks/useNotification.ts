import create from "zustand";

type Vertical = "top" | "bottom";
type Horizontal = "right" | "left";

type Position = `${Vertical}-${Horizontal}` | `${Vertical}-center` | "center";
type Component = () => JSX.Element | null;

type State = {
  show: boolean;
  component: Component;
  position: Position;
  timer: number;
};

interface StateWithMutation extends State {
  openNotification: (component: Component, position?: Position) => void;
  closeNotification: () => void;
  setTimer: (timer: number) => void;
}

export const useNotification = create<StateWithMutation>((set) => ({
  show: false,
  timer: 4000,
  component: () => null,
  position: "bottom-right",
  openNotification: (component, position) => {
    set((state) => ({
      ...state,
      show: true,
      component,
      position: position ?? state.position,
    }));
  },
  closeNotification: () => {
    set((state) => ({ ...state, show: false }));
  },
  setTimer: (timer) => {
    set((state) => ({ ...state, timer }));
  },
}));
