"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import NavBar from "@/app/components/Home/NavBar";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { pusherClient } from "@/lib/pusher"; // Ensure path is correct
import { useSession } from "next-auth/react";

// --- Type Definitions ---
interface User {
  id: string;
  name: string;
  image?: string;
  email?: string;
}

interface Participant {
  user: User;
}

interface Message {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
}

interface Conversation {
  id: string;
  participants: Participant[];
  updatedAt: string;
  lastMessage?: string; // Optional: good for sidebar preview
}

export default function MessagesPage({
  conversationId,
}: {
  conversationId?: string; // Made optional to handle direct navigation
}) {
  // --- State ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    conversationId || null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Derive the active conversation object from the ID
  const activeChat = useMemo(
    () => conversations.find((c) => c.id === activeChatId),
    [conversations, activeChatId],
  );

  // --- 1. Fetch Conversations ---
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  // --- 2. Fetch Messages ---
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?conversationId=${activeChatId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // --- 3. Pusher Subscription ---
  useEffect(() => {
    if (!activeChatId) return;

    const channelName = `conversation-${activeChatId}`;
    const channel = pusherClient.subscribe(channelName);

    const messageHandler = (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicates based on ID
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Optional: Update conversation list "last updated" time locally
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    };

    channel.bind("new-message", messageHandler);

    return () => {
      channel.unbind("new-message", messageHandler);
      pusherClient.unsubscribe(channelName);
    };
  }, [activeChatId]);

  // --- 4. Auto Scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingMessages]);

  // --- Handlers ---
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Clear immediately for UX

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeChatId,
          text: messageToSend,
        }),
      });
      // No need to setMessages here; Pusher will handle the update
    } catch (error) {
      console.error("Failed to send:", error);
      setNewMessage(messageToSend); // Restore text on error
    }
  };

  // Helper to find the "other" user in a conversation
  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.user.id !== currentUserId)
      ?.user;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* --- Left Sidebar: Conversation List --- */}
        <div className="w-1/3 md:w-1/4 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {conversations.map((c) => {
              const otherUser = getOtherUser(c);
              const isActive = activeChatId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`flex items-center gap-3 p-3 mb-1 rounded-xl cursor-pointer transition-colors ${
                    isActive ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    {otherUser?.image ? (
                      <Image
                        src={otherUser.image}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {otherUser?.name?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900 truncate">
                      {otherUser?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Right Panel: Chat Window --- */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeChatId ? (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <FaSpinner className="animate-spin text-gray-400 text-2xl" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                    No messages yet. Say hi!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isSender =
                      Number(m.senderId) === Number(currentUserId);

                    return (
                      <div
                        key={m.id}
                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                            isSender
                              ? "bg-[#00b894] text-white rounded-tr-none"
                              : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p>{m.text}</p>
                          <span
                            className={`text-[10px] mt-1 block text-right ${
                              isSender ? "text-green-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
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
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-[#00b894]/50 focus-within:border-[#00b894]">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-full transition-all ${
                      newMessage.trim()
                        ? "bg-[#00b894] text-white hover:bg-[#019a7a] shadow-md"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <FaPaperPlane className="text-6xl mb-4 opacity-10" />
              <p className="font-medium">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
