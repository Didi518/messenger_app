"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useUserContext } from "@/context/userContext";
import { useChatContext } from "@/context/chatContext";
import { IUser } from "@/types/types";
import { ban, check } from "@/utils/icons";

function FriendRequest() {
  const { user, acceptFriendRequest } = useUserContext();
  const { getUserById, createChat } = useChatContext();
  const [requests, setRequests] = useState<IUser[]>([]);
  const { friendRequest } = user;

  useEffect(() => {
    const fetchRequests = async () => {
      const requestData = await Promise.all(
        friendRequest.map(async (id: string) => {
          const userData = await getUserById(id);
          return userData;
        })
      );

      setRequests(requestData);
    };

    if (friendRequest && friendRequest.length > 0) {
      fetchRequests();
    }
  }, [friendRequest, getUserById]);

  const sortedRequests = requests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {requests.length > 0 && (
        <div>
          {sortedRequests.map((request: IUser) => {
            const { friends } = request;

            return (
              <div
                key={request._id}
                className="flex justify-between items-center p-4 border-b-2 cursor-pointer border-white dark:border-[#3C3C3C]/60 hover:bg-blue-50 dark:hover:bg-white/5 transition-all duration-300 ease-out"
              >
                <div className="flex gap-3">
                  <Image
                    src={request.photo}
                    alt="profil"
                    width={50}
                    height={50}
                    className="rounded-full aspect-square object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-[#AAA]">
                      {friends.length <= 1
                        ? `${friends.length} ami`
                        : `${friends.length} amis`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-[#F56693] text-white px-4 py-2 rounded-full">
                    {ban}
                  </button>
                  <button
                    className="flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-[#7263F3] text-white px-4 py-2 rounded-full"
                    onClick={() => {
                      acceptFriendRequest({ requestingUserId: request._id });
                      createChat(user._id, request._id);
                    }}
                  >
                    {check}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FriendRequest;
