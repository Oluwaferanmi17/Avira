/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import NavBar from "@/app/components/Home/NavBar";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
export default function Messaging({
  currentRole = "Host",
}: {
  currentRole?: "Host" | "User";
}) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Failed to load conversations");

        const data = await res.json();
        setConversations(data);
        if (conversationId) {
          const convo = data.find((c: any) => c.id === conversationId);
          if (convo) setSelectedConversation(convo);
        }
        if (data.length > 0) setActiveChatId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [conversationId]);

  const activeChat = conversations.find((c) => c.id === activeChatId);
  useEffect(() => {
    if (!activeChatId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeChatId}`);
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    const channel = pusherClient.subscribe(`conversation-${activeChatId}`);

    // channel.bind("new-message", (message: any) => {
    //   setMessages((prev) => {
    //     const exists = prev.some((m) => m.id === message.id);
    //     if (exists) return prev;
    //     // return exists ? prev : [...prev, message];
    //     return [...prev, message];
    //   });
    // });
    channel.bind("new-message", (message: any) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === message.id && m.text === message.text
        );
        return exists ? prev : [...prev, message];
      });
    });
    return () => {
      pusherClient.unsubscribe(`conversation-${activeChatId}`);
    };
  }, [activeChatId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeChatId,
          text: newMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      // const message = await res.json();
      // setMessages((prev) => [...prev, message]);
      setNewMessage("");
      const message = await res.json();
      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, lastMessage: message.text }
            : chat
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="bg-white rounded-xl shadow-md flex h-[500px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                activeChatId === chat.id ? "bg-green-100" : ""
              }`}
            >
              <FaUserCircle className="text-3xl text-gray-500" />
              <div>
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500 truncate w-40">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 p-4 font-semibold">
            {activeChat?.participants
              ?.map((p: any) => p.user.name)
              .filter((name: string | null) => name)
              .join(", ") || activeChat?.name}
          </div>

          {/* <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeChat?.participants
              ?.map((p: any) => p.user.name)
              .filter((name: string | null) => name)  
              .join(", ") || activeChat?.name}
          </div> */}

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => {
              const isSender = msg.senderId === currentUserId;
              const uniqueKey = `${msg.id || msg._id || "local"}-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg text-sm max-w-xs ${
                      isSender
                        ? "bg-[#00b894] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {new Date(msg.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#00b894] text-white p-2 rounded-lg hover:bg-[#019a7a] transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
