import axios from "axios";
import { getAuth, User } from "firebase/auth";
import create from "zustand";

type UserType = User & {
  screenName?: string;
  followers?: number | string;
  following?: number | string;
  wallet?: string;
  profile_image?: string;
};

type State = {
  users: UserType[] | null;
  currentUser: UserType | null;
};

interface StateWithMutation extends State {
  login: (payload: User) => void;
  setTwitterData: (payload: {
    followers?: number | string;
    following?: number | string;
    wallet?: string;
  }) => void;
  logout: () => void;
  removeUser: () => void;
  getDataFromStorage: () => void;
  changeUser: (screenName: string) => void;
}

export const useTwitterUser = create<StateWithMutation>((set) => ({
  users: [],
  currentUser: null,
  login: async (payload) => {
    const currentUser = {
      ...payload,
      screenName: (payload as any)?.reloadUserInfo?.screenName,
      followers: undefined,
      following: undefined,
      profile_image: undefined,
    };
    try {
      const result = await axios.get(
        `/api/get-twitter-data?user_id=${payload.providerData[0].uid}`
      );
      const {
        followers,
        following,
        name,
        screen_name,
        profile_image_url_https,
      } = result.data.data;
      currentUser.followers = followers;
      currentUser.following = following;
      currentUser.displayName = name;
      currentUser.screenName = screen_name;
      currentUser.profile_image = profile_image_url_https;
    } catch (error) {
      console.log(error);
    } finally {
      let setUsers = false;
      const usersFromStorage = JSON.parse(localStorage.getItem("users")!) as
        | UserType[]
        | null;

      const findIsUserAvailable = usersFromStorage?.findIndex(
        (user) => user.screenName === currentUser.screenName
      );
      if (findIsUserAvailable === -1) {
        setUsers = true;
      }

      set((state) => {
        const users =
          state.users && setUsers
            ? [...state.users, currentUser]
            : [currentUser];

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        return {
          ...state,
          users,
          currentUser,
        };
      });
    }
  },
  logout: () => {
    localStorage.removeItem("currentUser");
    set((state) => ({ ...state, currentUser: null }));
  },
  removeUser: () => {
    set((state) => {
      const auth = getAuth();
      const users = state.users?.filter(
        (user) => user.screenName === (auth as any).reloadUserInfo?.screenName
      );

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.removeItem("currentUser");

      return {
        ...state,
        users,
        currentUser: null,
      };
    });
  },
  setTwitterData: (payload) => {
    set((state) => {
      let currentUser = {} as User;
      if (state.currentUser) {
        currentUser = { ...state.currentUser, ...payload };
      }

      return {
        ...state,
        currentUser,
      };
    });
  },
  getDataFromStorage: () => {
    const users = JSON.parse(localStorage.getItem("users")!) as
      | UserType[]
      | null;
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")!
    ) as UserType | null;
    set((state) => ({ ...state, users, currentUser }));
  },
  changeUser: (payload) => {
    set((state) => {
      const currentUser =
        state.users?.find((user) => user.screenName === payload) ?? null;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      return {
        ...state,
        currentUser,
      };
    });
  },
}));
