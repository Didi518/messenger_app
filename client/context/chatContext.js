import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client";

import { useUserContext } from "./userContext";

const ChatContext = createContext();

const serverUrl = "http://localhost:8080";

export const ChatProvider = ({ children }) => {
  const { user } = useUserContext();
  const userId = user?._id;
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allChatsData, setAllChatsData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeChatData, setActiveChatData] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivedMessage, setArrivedMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io(serverUrl);

    newSocket.on("connect", () => {
      console.log("connecté au serveur");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("déconnecté du serveur", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    socket?.emit("add user", user._id);
    socket?.on("get users", (users) => {
      const getOnlineUsers = async () => {
        try {
          const usersOnline = await Promise.all(
            users.map(async (user) => {
              const userData = await getUserById(user.userId);
              return userData;
            })
          );

          usersOnline.filter((user) => user._id !== userId);

          const isFriend = usersOnline.filter((friend) =>
            user.friends.includes(friend._id)
          );

          setOnlineUsers(isFriend);
        } catch (error) {
          console.log("Erreur avec getOnlineUsers", error.message);
        }
      };

      getOnlineUsers();
    });

    socket?.on("get message", (data) => {
      setArrivedMessage({
        sender: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket?.off("get users");
      socket?.off("get message");
    };
  }, [user]);

  useEffect(() => {
    if (
      arrivedMessage &&
      selectedChat &&
      selectedChat.participants.includes(arrivedMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivedMessage]);
    }
  }, [arrivedMessage, selectedChat?._id]);

  const getUserById = async (id) => {
    try {
      if (!id) return;

      const res = await axios.get(`${serverUrl}/api/v1/user/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error avec getUserById", error.message);
    }
  };

  const fetchChats = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${serverUrl}/api/v1/chats/${userId}`);

      setChats(res.data);
    } catch (error) {
      console.log("Error avec fetchChats", error.message);
    }
  };

  const fetchMessages = async (chatId, limit = 15, offset = 0) => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`, {
        params: { limit, offset },
      });

      setMessages(res.data);
    } catch (error) {
      console.log("Error avec fetcMessages", error.message);
    }
  };

  const fetchAllMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`);

      return res.data;
    } catch (error) {
      console.log("Error avec fetchAllMessages", error.message);
    }
  };

  const getAllChatsData = async () => {
    try {
      const updatedChats = await Promise.all(
        chats.map(async (chat) => {
          const participantsData = await Promise.all(
            chat.participants
              .filter((participant) => participant !== userId)
              .map(async (participant) => {
                const user = await getUserById(participant);
                return user;
              })
          );

          return {
            ...chat,
            participantsData,
          };
        })
      );

      setAllChatsData(updatedChats);
    } catch (error) {
      console.log("Error avec getAllChatsData", error.message);
    }
  };

  const sendMessage = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/message`, data);

      setMessages((prev) => [...prev, res.data]);

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              lastMessage: res.data,
              updatedAt: new Date().toISOString(),
            };
          }

          return chat;
        });

        updatedChats.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        return updatedChats;
      });

      socket.emit("send message", {
        senderId: data.sender,
        receiverId: activeChatData._id,
        text: data.content,
      });

      return res.data;
    } catch (error) {
      console.log("Erreur avec sendMessage", error.message);
    }
  };

  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);

    const isNotLoggedInUser = chat.participants.find(
      (participant) => participant !== userId
    );

    const data = await getUserById(isNotLoggedInUser);

    setActiveChatData(data);
  };

  const createChat = async (senderId, receiverId) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/chats`, {
        senderId,
        receiverId,
      });

      setChats((prev) => [...prev, res.data]);

      return res.data;
    } catch (error) {
      console.log("Erreur avec createChat", error.message);
    }
  };

  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`);

      setChats([]);
      setMessages([]);
      setAllChatsData([]);
      setSelectedChat(null);
      setActiveChatData({});
      setOnlineUsers([]);
      setSocket(null);
      setArrivedMessage(null);

      toast.success("Vous êtes bien déconnecté");

      router.push("/connexion");
    } catch (error) {
      console.log("Erreur lors de la déconnexion, ", error.message);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chats && user) {
      getAllChatsData();
    }
  }, [chats, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        getUserById,
        allChatsData,
        selectedChat,
        handleSelectedChat,
        fetchAllMessages,
        activeChatData,
        sendMessage,
        logoutUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
