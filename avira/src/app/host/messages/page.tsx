"use client";
import { useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
const mockConversations = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Looking forward to my stay!",
    messages: [
      {
        sender: "John Doe",
        text: "Hi! Is the apartment still available?",
        time: "10:30 AM",
      },
      {
        sender: "You",
        text: "Yes, it's available. Do you want to book?",
        time: "10:32 AM",
      },
      {
        sender: "John Doe",
        text: "Sure! Looking forward to my stay!",
        time: "10:35 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    lastMessage: "Can I check in early?",
    messages: [
      {
        sender: "Sarah Smith",
        text: "Hi, can I check in at 12 PM?",
        time: "08:15 AM",
      },
      { sender: "You", text: "Yes, that's fine.", time: "08:20 AM" },
    ],
  },
];
export default function Messaging() {
  const [activeChat, setActiveChat] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const handleSend = () => {
    if (!newMessage.trim()) return;
    const updatedChat = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        { sender: "You", text: newMessage, time: "Now" },
      ],
    };
    setActiveChat(updatedChat);
    setNewMessage("");
  };
  return (
    <div className="bg-white rounded-xl shadow-md flex h-[500px] overflow-hidden">
      {/* Sidebar with conversations */}
      <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        {mockConversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
              activeChat.id === chat.id ? "bg-green-100" : ""
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
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 font-semibold">
          {activeChat.name}
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg text-sm max-w-xs ${
                  msg.sender === "You"
                    ? "bg-green-100 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
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
  );
}
