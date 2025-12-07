import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="w-full h-full bg-zinc-900 text-white flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-lg font-semibold">Meeting chat</h1>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">Start chatting...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-4">
              <p className="text-xs text-gray-400 mb-1">{msg.from}</p>
              <p className="bg-zinc-800 px-3 py-2 rounded-lg inline-block text-sm">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-zinc-700 flex gap-2">
        <input
          className="flex-1 bg-zinc-800 px-3 py-2 rounded-md text-sm outline-none border border-zinc-600"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          <AiOutlineSend  size={20}/>
        </button>
      </div>

    </div>
  );
};

export default Chat;
