import { useEffect, useLayoutEffect, useRef } from "react";

import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IMessage } from "@/types/types";
import Sender from "../../Sender/Sender";
import Receiver from "../../Receiver/Receiver";

function Body() {
  const { messages, arrivedMessage } = useChatContext();
  const userId = useUserContext().user?._id;
  const messageBodyRef = useRef<HTMLDivElement>(null) as any;

  const scrollToBottom = (behavior: string = "smooth") => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTo({
        top: messageBodyRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useLayoutEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (arrivedMessage && arrivedMessage.sender !== userId) {
      scrollToBottom("smooth");
    }
  }, [arrivedMessage]);

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]);

  return (
    <div
      ref={messageBodyRef}
      className="message-body relative flex-1 p-4 overflow-y-auto"
    >
      <div className="relative flex flex-col">
        {messages.map((message: IMessage) =>
          message.sender === userId ? (
            <div key={message?._id} className="self-end mb-2">
              <Sender
                status={message.status}
                content={message.content}
                createdAt={message.createdAt}
              />
            </div>
          ) : (
            <div key={message?._id}>
              <Receiver
                messageId={message?._id}
                content={message.content}
                createdAt={message.createdAt}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Body;
