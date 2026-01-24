"use client";

import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUserCircle, FaSpinner } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import NavBar from "@/app/components/Home/NavBar";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";

// --- Types ---
interface User {
  id: string;
  name: string;
  image?: string;
}

interface Participant {
  user: User;
}

interface Conversation {
  id: string;
  name?: string;
  lastMessage?: string;
  participants: Participant[];
}

interface Message {
  id: string;
  text: string;
  createdAt: string | Date;
  senderId: {
    id: string;
    name: string;
  };
}

export default function Messaging() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdParam = searchParams.get("conversationId");

  // --- State ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- 1. Fetch Conversations & Handle URL Params ---
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Failed to load conversations");

        const data: Conversation[] = await res.json();
        setConversations(data);

        // If URL has an ID, select it. Otherwise, select the first one.
        if (conversationIdParam) {
          const exists = data.find((c) => c.id === conversationIdParam);
          if (exists) setActiveChatId(conversationIdParam);
        } else if (data.length > 0) {
          setActiveChatId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [conversationIdParam]);

  // --- 2. Fetch Messages for Active Chat ---
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?conversationId=${activeChatId}`);
        if (!res.ok) throw new Error("Failed to load messages");
        const data: Message[] = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // --- 3. Pusher Subscription ---
  useEffect(() => {
    if (!activeChatId) return;

    const channel = pusherClient.subscribe(`conversation-${activeChatId}`);

    const messageHandler = (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Update the last message snippet in the sidebar list dynamically
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, lastMessage: message.text } : c,
        ),
      );
    };

    channel.bind("new-message", messageHandler);

    return () => {
      channel.unbind("new-message", messageHandler);
      pusherClient.unsubscribe(`conversation-${activeChatId}`);
    };
  }, [activeChatId]);

  // --- 4. Auto-scroll to bottom ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingMessages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Optimistic clear of input for better UX

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeChatId,
          text: messageToSend,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
        // Optional: Restore input text if failed
        // setNewMessage(messageToSend);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    // Optional: Update URL without reloading page
    // router.push(`/messages?conversationId=${id}`, { scroll: false });
  };

  // Derive active chat object
  const activeChat = conversations.find((c) => c.id === activeChatId);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />

      <div className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div className="bg-white rounded-xl shadow-md flex h-[calc(100vh-140px)] overflow-hidden border border-gray-200">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">
                  No conversations yet.
                </p>
              ) : (
                conversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition border-b border-gray-50 ${
                      activeChatId === chat.id
                        ? "bg-green-50 border-l-4 border-l-[#00b894]"
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="relative">
                      <FaUserCircle className="text-4xl text-gray-300" />
                      {/* You could add an online status dot here */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {chat.participants
                          ?.map((p) => p.user.name)
                          .filter(
                            (name) => name && name !== session?.user?.name,
                          )
                          .join(", ") || "Chat"}
                      </p>
                      <p
                        className={`text-sm truncate ${activeChatId === chat.id ? "text-green-700 font-medium" : "text-gray-500"}`}
                      >
                        {chat.lastMessage || "Start a conversation"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-50/50">
            {activeChatId ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {activeChat?.participants
                      ?.map((p) => p.user.name)
                      .filter((name) => name && name !== session?.user?.name)
                      .join(", ") || "Chat"}
                  </h3>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full text-gray-400">
                      <FaSpinner className="animate-spin text-2xl" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                      <p>No messages yet. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSender =
                        Number(msg.senderId) === Number(currentUserId);
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm max-w-sm shadow-sm ${
                              isSender
                                ? "bg-[#00b894] text-white rounded-tr-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`text-[10px] block text-right mt-1 ${isSender ? "text-green-100" : "text-gray-400"}`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-[#00b894]/20 focus-within:border-[#00b894]">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-500"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-full transition ${
                        newMessage.trim()
                          ? "bg-[#00b894] text-white hover:bg-[#019a7a] shadow-md transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaPaperPlane className="text-sm" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FaPaperPlane className="text-6xl mb-4 opacity-20" />
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
