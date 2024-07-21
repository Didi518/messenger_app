"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { useUserContext } from "@/context/userContext";
import { IUser } from "@/types/types";
import { addFriend, pending, userCheck } from "@/utils/icons";

function SearchResults() {
  const { searchResults, sendFriendRequest } = useUserContext();
  const userId = useUserContext().user?._id;
  const [requests, setRequests] = useState({});

  const handleFriendRequest = async (recipientId: string) => {
    await sendFriendRequest({ recipientId });

    setRequests((prev) => ({ ...prev, [recipientId]: true }));
  };

  return (
    <div>
      <div>
        {searchResults.data?.map((user: IUser) => {
          const { friends, friendRequest } = user;
          const isFriend = friends?.find((friend) => friend === userId);
          const requestSent = friendRequest?.find(
            (friend) =>
              friend === userId ||
              // @ts-ignore
              requests[user._id]
          );

          return (
            <div
              key={user?._id}
              className="flex justify-between items-center p-4 border-b-2 border-white dark:border-[#3C3C3C]/60 hover:bg-blue-50 dark:hover:bg-white/5 transition-all duration-300 ease-in-out cursor-default"
            >
              <div className="flex gap-3">
                <Image
                  src={user?.photo}
                  alt="profil"
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-[#AAA]">
                    {friends.length <= 1
                      ? `${friends.length} ami`
                      : `${friends.length} amis`}
                  </p>
                </div>
              </div>
              <div>
                {isFriend ? (
                  <button
                    onClick={() => {
                      toast.success("Vous êtes déjà amis.");
                    }}
                    className="flex justify-center items-center bg-[#454E56] text-white px-4 py-2 h-[2.5rem] w-[2.5rem] rounded-full"
                  >
                    {userCheck}
                  </button>
                ) : (
                  <button
                    onClick={() => handleFriendRequest(user._id)}
                    className="flex justify-center items-center bg-[#7263F3] text-white px-4 py-2 h-[2.5rem] w-[2.5rem] rounded-full"
                  >
                    {requestSent ? pending : addFriend}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResults;
