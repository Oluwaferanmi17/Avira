/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NavBar from "@/app/components/Home/NavBar";
import { FaPaperPlane } from "react-icons/fa";
import { pusherClient } from "../../../lib/pusher";
import { useSession } from "next-auth/react";
interface User {
  id: string;
  name: string;
  image?: string;
}

interface Conversation {
  id: string;
  participants: { user: User }[];
  updatedAt: string;
}

export default function MessagesPage({
  conversationId,
}: {
  conversationId: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  // ✅ Fetch all guest conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, []);

  // ✅ Fetch messages when user selects a conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        const res = await fetch(
          `/api/messages?conversationId=${selectedConversation.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [selectedConversation]);
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = pusherClient.subscribe(
      `conversation-${selectedConversation.id}`
    );

    channel.bind("new-message", (message: any) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === message.id || m.time === message.time
        );
        return exists ? prev : [...prev, message];
      });
    });

    return () => {
      pusherClient.unsubscribe(`conversation-${selectedConversation.id}`);
    };
  }, [selectedConversation]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // ✅ Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          text: newMessage,
        }),
      });

      if (res.ok) {
        // const msg = await res.json();
        // setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex h-screen">
        {/* Left Sidebar - Conversation List */}
        <div className="w-1/3 border-r overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          {conversations.map((c) => {
            const otherUser = c.participants.find(
              (p) => p.user.name !== "You"
            )?.user;
            return (
              <div
                key={c.id}
                className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedConversation?.id === c.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedConversation(c)}
              >
                {otherUser?.image && (
                  <Image
                    src={otherUser.image}
                    alt={otherUser.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{otherUser?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 flex flex-col h-screen">
          {selectedConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, index) => {
                  const isSender = m.senderId === currentUserId; // or m.senderId === session.user.id if available
                  return (
                    <div
                      key={`${m.id || m._id || index}-${m.time || Date.now()}`}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-xs text-sm shadow-md
                  ${
                    isSender
                      ? "bg-[#00b894] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                      >
                        <p>{m.text}</p>
                        <span
                          className={`text-[10px] mt-1 block ${
                            isSender ? "text-blue-100" : "text-gray-600"
                          }`}
                        >
                          {new Date(m.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div ref={messagesEndRef} />
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t flex-shrink-0 flex bg-white sticky bottom-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#00b894] text-white p-2 rounded-lg hover:bg-[#019a7a] transition"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
