import { DarkMode } from "../../icons/darkMode";
import { Market } from "../../icons/market";
import { Mint } from "../../icons/mint";
import { MyPortfolio } from "../../icons/myPortfolio";
import { Settings } from "../../icons/settings";
import { TokenEarnings } from "../../icons/tokenEarnings";

export const sideNavItems = {
  menuItems: [
    {
      items: [
        {
          secondTitle: "Dashboard",
          link: "/",
        },
        {
          title: "Market",
          icon: <Market />,
          link: "/",
          comingSoon: true,
        },
      ],
    },
    {
      items: [
        { secondTitle: "Profile", link: "/" },
        {
          title: "My Knights",
          icon: <MyPortfolio className="fill-gray-500 hover:fill-white" />,
          link: "/",
        },
        {
          title: "Earn Gold",
          icon: <TokenEarnings className="fill-gray-500 hover:fill-white" />,
          link: "/earn-gold",
        },
        // {
        //   title: "History",
        //   icon: <Dashboard className="fill-gray-500 hover:fill-white" />,
        //   link: "/",
        // },
        {
          title: "Settings",
          icon: <Settings className="fill-gray-500 hover:fill-white" />,
          link: "/",
          comingSoon: true,
        },
      ],
    },
    {
      items: [
        { secondTitle: "Other" },
        {
          title: "Light Mode",
          icon: <DarkMode className="fill-gray-500 hover:fill-white" />,
          link: "/",
        },
      ],
    },
  ],
};
