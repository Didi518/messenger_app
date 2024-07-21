"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useUserContext } from "@/context/userContext";
import { useGlobalContext } from "@/context/globalContext";
import { useChatContext } from "@/context/chatContext";
import {
  archive,
  chat,
  database,
  group,
  inbox,
  moon,
  sun,
} from "@/utils/icons";
import { gradientText } from "@/utils/tailwindStyles";
import { IChat, IUser } from "@/types/types";

import SearchInput from "../SearchInput/SearchInput";
import ChatItem from "../ChatItem/ChatItem";
import SearchResults from "../SearchResults/SearchResults";
import FriendRequest from "../FriendRequest/FriendRequest";

const navButtons = [
  {
    id: 0,
    name: "Conversations",
    icon: inbox,
    slug: "conversations",
  },
  {
    id: 1,
    name: "Archivés",
    icon: archive,
    slug: "archives",
  },
  {
    id: 2,
    name: "Demandes",
    icon: group,
    slug: "demandes",
    notification: true,
  },
];

function Sidebar() {
  const { user, updateUser, searchResults } = useUserContext();
  const { showProfile, handleProfileToggle, currentView, handleViewChange } =
    useGlobalContext();
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const { photo, friendRequest } = user;
  const [activeNav, setActiveNav] = useState(navButtons[0].id);

  const lightTheme = () => {
    updateUser({ theme: "light" });
  };

  const darkTheme = () => {
    updateUser({ theme: "dark" });
  };

  useEffect(() => {
    document.documentElement.className = user.theme;
  }, [user.theme]);

  return (
    <div className="w-[25rem] flex border-r-2 border-white dark:border-[#3C3C3C]/60">
      <div className="p-4 flex flex-col justify-between items-center border-r-2 border-white dark:border-[#3C3C3C]/60">
        <div
          className="profile flex flex-col items-center"
          onClick={() => handleProfileToggle(true)}
        >
          <Image
            src={photo}
            alt="profil"
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover border-2 border-white dark:border-[#3C3C3C]/65 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text"
          />
        </div>
        <div className="w-full relative py-4 flex flex-col items-center gap-8 text-lg border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px]">
          {navButtons.map((btn, i: number) => {
            return (
              <button
                key={btn.id}
                className={`${
                  activeNav === i ? "active-nav" : ""
                } relative p-1 flex items-center text-[#454E56] dark:text-white/65`}
                onClick={() => {
                  setActiveNav(btn.id);
                  handleViewChange(btn.slug);
                  handleProfileToggle(false);
                }}
              >
                {btn.icon}
                {btn.notification && (
                  <span className="absolute -top-2 right-0 w-4 h-4 bg-[#F00] text-white text-xs rounded-full flex items-center justify-center">
                    {friendRequest?.length > 0 ? friendRequest.length : 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-2 text-[#454e56] text-xl flex flex-col gap-2 border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px] shadow-sm dark:text-white/65">
          <button
            className={`${
              user?.theme === "light"
                ? `inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#7263f3] to-[#f56693]`
                : ""
            }`}
            onClick={() => lightTheme()}
          >
            {sun}
          </button>
          <span className="w-full h-[2px] bg-white dark:bg-[#3C3C3C]/60"></span>
          <button
            className={`${user?.theme === "dark" ? "text-white" : ""}`}
            onClick={() => darkTheme()}
          >
            {moon}
          </button>
        </div>
      </div>
      <div className="pb-4 flex-1">
        <h2
          className={`px-4 mt-6 font-bold text-2xl ${gradientText} dark:text-white`}
        >
          Messages
        </h2>
        <div className="mt-2 px-4">
          <SearchInput />
        </div>
        {searchResults?.data?.length > 0 && (
          <div className="mt-4">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              {database} Résultats de la recherche
            </h4>
            <SearchResults />
          </div>
        )}
        {currentView === "conversations" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              {chat}
              <span>Conversations</span>
            </h4>
            <div className="mt-2">
              {allChatsData.map((chat: IChat) => {
                return (
                  <React.Fragment key={chat._id}>
                    {chat?.participantsData?.map((participant: IUser) => {
                      return (
                        <ChatItem
                          key={participant._id}
                          user={participant}
                          active={
                            !showProfile && selectedChat?._id === chat._id
                          }
                          chatId={chat._id}
                          onClick={() => {
                            handleProfileToggle(false);
                            handleSelectedChat(chat);
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        {currentView === "archives" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              <span>{archive}</span> <span>Archives</span>
            </h4>
            <div className="mt-2">
              <p className="px-4 pb-2 text-[#454E56] dark:text-white/65">
                Aucune conversation archivée
              </p>
            </div>
          </div>
        )}
        {currentView === "demandes" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              <span className="w-[20px]">{group}</span>
              <span>Demandes d'amitié</span>
            </h4>

            <div className="mt-2">
              {friendRequest?.length > 0 ? (
                <FriendRequest />
              ) : (
                <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                  Aucune demande d'amitié
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
