"use client";

import { useGlobalContext } from "@/context/globalContext";
import { useChatContext } from "@/context/chatContext";
import useRedirect from "@/hooks/useUserRedirect";

import Sidebar from "./Components/Sidebar/Sidebar";
import Header from "./Components/Messages/Header/Header";
import Body from "./Components/Messages/Body/Body";
import TextArea from "./Components/Messages/TextArea/TextArea";
import Profile from "./Components/Profile/Profile";
import Online from "./Components/Online/Online";
import FriendProfile from "./Components/FriendProfile/FriendProfile";

export default function Home() {
  const { currentView, showFriendProfile, showProfile } = useGlobalContext();
  const { selectedChat } = useChatContext();

  useRedirect("/connexion");

  return (
    <div className="relative px-[10rem] py-10 h-full">
      <main className="h-full flex backdrop-blur-sm rounded-3xl bg-white/65 dark:bg-[#262626]/90 border-2 border-white dark:border-[#3C3C3C]/65 shadow-sm overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="relative flex-1 border-r-2 border-white dark:border-[#3C3C3C]/60">
            {!showProfile && selectedChat && <Header />}
            {!showProfile && selectedChat && <Body />}
            <div className="absolute w-full px-4 pb-4 left-0 bottom-0">
              {!showProfile && selectedChat && <TextArea />}
            </div>
            {showProfile && (
              <div className="flex flex-col items-center justify-center h-full">
                <Profile />
              </div>
            )}
          </div>
          <div className="w-[30%]">
            {!showFriendProfile && <Online />}
            {showFriendProfile && <FriendProfile />}
          </div>
        </div>
      </main>
    </div>
  );
}
