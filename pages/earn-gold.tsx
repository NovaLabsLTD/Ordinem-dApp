import { Tab } from "@headlessui/react";
import Follow from "components/earnGold/follow";
import Tweet from "components/earnGold/tweet";
import { useTwitterUser } from "hooks/useTwitterUser";
import { Fragment } from "react";

export default function EarnGold() {
  const tabs = [
    {
      title: "Daily Quests",
      comingSoon: true,
    },
    {
      title: "Follow",
      component: <Follow />,
    },
    {
      title: "Tweet",
      component: <Tweet />,
    },
  ];
  const { currentUser } = useTwitterUser();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
      <Tab.Group defaultIndex={1}>
        <Tab.List className="flex flex-wrap md:flex-col gap-x-3 gap-y-6">
          {tabs.map((tab, i) => (
            <Tab key={i} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`text-white px-5 py-2 rounded-md border border-gray-800 dark:border-gray-400 ${
                    selected
                      ? "bg-gradient text-gray-800 dark:text-white"
                      : "bg-gray-800"
                  } ${tab.comingSoon && "pointer-events-none opacity-80"}`}
                >
                  {tab.title}
                  {tab.comingSoon && (
                    <span className="rounded-lg ml-2 px-4 py-1 text-sm bg-gray-300 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                      Soon
                    </span>
                  )}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="md:col-span-2 text-white">
          {tabs.map((tab, i) => (
            <Tab.Panel
              className="bg-[#270318] border border-gray-400 px-5 py-3 rounded-md min-h-[20rem]"
              key={i}
            >
              {!currentUser ? (
                <div className="w-full min-h-[20rem] text-xl h-full flex text-center justify-center items-center">
                  <h4>Login with twitter to access quests</h4>
                </div>
              ) : (
                <>
                  <h2>{tab.title}</h2>
                  {tab.component}
                </>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
