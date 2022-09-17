import Link from "next/link";
import Image from "next/image";
import { sideNavItems } from "../../utils/sideNavItems/SideNavItems";
import { Twitter } from "../../icons/twitter";
import { FollowIcon } from "../../icons/followIcon";
import { ArrowRight } from "../../icons/arrowRight";
import { Moon } from "../../icons/moon";
import { useTheme } from "next-themes";
import { Sun } from "../../icons/sun";
import { useState, useEffect } from "react";
import { useTwitterUser } from "hooks/useTwitterUser";
import SignInWithTwitter from "components/buttons/SignInWithTwitter";
import { useSideNav } from "hooks/useSideNav";
import { useWindowSize } from "hooks/useWindowSize";
import TwitterInputLogin from "components/TwitterInputLogin";

export const Sidenav = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { show, close } = useSideNav();
  const { width } = useWindowSize();
  const { currentUser } = useTwitterUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <button onClick={() => setTheme("light")}>
          <div className="flex justify-between px-4 py-2 transition-all duration-200 w-80 hover:bg-primary-500 hover:text-white dark:text-dark-text-500 hover:dark:text-white group">
            <span className="text-base">Light Mode</span>
            <span className="mr-2">
              <Sun />
            </span>
          </div>
        </button>
      );
    } else {
      return (
        <button onClick={() => setTheme("dark")}>
          <div className="flex justify-between px-4 py-2 transition-all duration-200 w-80 hover:bg-primary-500 hover:text-white dark:text-dark-text-500">
            <span className="text-base">Dark Mode</span>
            <span className="mr-2">
              <Moon />
            </span>
          </div>
        </button>
      );
    }
  };

  return (
    <>
      {/* overlay */}
      {/* <div className="fixed inset-x-0 inset-y-0 transition-all duration-75 bg-[#3a3a3a70]" /> */}
      {width < 1024 && show && (
        <div
          onClick={close}
          className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-80 z-40"
        ></div>
      )}
      <div
        style={{
          transform: `translateX(${width >= 1024 ? 0 : show ? 0 : "-100%"})`,
        }}
        className="fixed z-50 h-full overflow-hidden overflow-y-auto transition-all duration-300 transform bg-white shadow-lg w-80 dark:bg-nav-dark-500"
      >
        <Link className="" href={"/"}>
          <a className="flex items-center py-4">
            <Image src="/logo.png" width="40px" height="40px" alt="logo" />
            <div>
              <span className="text-xl font-bold text-black dark:text-white">
                Ordinem
              </span>
              <p className="text-xs text-[#7A797D]">
                Knights of the round table.
              </p>
            </div>
          </a>
        </Link>
        <div>
          {sideNavItems.menuItems.map((item, index) => {
            return (
              <div key={index}>
                {item.items.map(
                  (
                    { secondTitle, link, title, icon, ...props },
                    menuItemIndex
                  ) => {
                    const comingSoon = (props as any)?.comingSoon;
                    return (
                      <div key={menuItemIndex}>
                        {title !== "Light Mode" ? (
                          <div
                            className={`flex flex-col ${
                              comingSoon && "pointer-events-none"
                            }`}
                          >
                            <span className="px-4 pt-4 text-xs text-gray-800 dark:text-gray-50">
                              {secondTitle}
                            </span>
                            {title != null && (
                              <Link href={link ?? ""}>
                                <a className="flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:bg-primary-500 hover:text-white dark:text-dark-text-500 hover:dark:text-white group">
                                  <span className="mr-2">{icon}</span>
                                  <span className="text-base">{title}</span>
                                  {comingSoon && (
                                    <span className="rounded-lg px-4 py-1 text-sm bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                      Coming Soon
                                    </span>
                                  )}
                                </a>
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div>{renderThemeChanger()}</div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
          <div className="flex w-full mt-20">
            <TwitterCard />
            {!currentUser && (
              <div className="flex flex-col gap-4 items-center">
                <SignInWithTwitter />
                <h5>OR</h5>
                <TwitterInputLogin />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const TwitterCard = () => {
  const { currentUser: userData } = useTwitterUser();

  if (!userData) return null;
  return (
    <div className="w-full px-8 pb-8 mx-4 bg-gradient-to-bl from-primary-500 rounded-2xl to-secondary-500">
      <div className="mt-4">
        <Twitter className="" width="40" height="33" />
      </div>
      <div className="flex flex-col items-center mt-4">
        <div>
          <Image
            className="rounded-full"
            src={
              userData.profile_image ??
              userData?.photoURL ??
              "/pexels-vietnam-photographer-11293709.jpg"
            }
            width="50px"
            height="50px"
            alt="follow"
            layout="fixed"
          />
        </div>
        <p className="text-base text-white">
          {userData?.displayName ?? "Alisson Mayer"}
        </p>
        <p className="text-sm text-gray-400">
          @{userData?.screenName ?? "m_alisson"}
        </p>
        <div className="flex mt-2">
          <p className="text-sm text-gray-400">
            <span className="text-white">{userData?.followers ?? 712}</span>{" "}
            Followers
          </p>
          <p className="ml-2 text-sm text-gray-400">
            <span className="text-white">{userData?.following ?? 532}</span>{" "}
            Following
          </p>
        </div>
        <Link href={"/earn-gold"}>
          <a className="flex items-center justify-center w-full px-4 py-2 mt-8 bg-white rounded-2xl">
            <FollowIcon />
            <span className="mx-2 text-black">Earn Gold</span>
            <ArrowRight />
          </a>
        </Link>
      </div>
    </div>
  );
};
