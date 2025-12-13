import React, { useState, useRef, useEffect } from "react";
import { PanelLeftClose, Paperclip, SendHorizontal, Loader } from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";
import axios from 'axios'

const Chat = ({ setAiPannel, selectedJob }) => {
  console.log(selectedJob)
  const { authUser } = useAuthStore();

  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // send selected job to backend when panel opens
  useEffect(() => {
    if (!selectedJob) return;

    const buildPrompt = (job) => {
      const title = job.jobTitle || job.jobRole || 'Untitled Role';
      const company = job.companyName || 'Unknown Company';
      const location = job.location || 'Unspecified location';
      const skills = (job.primarySkills || []).join(', ') || 'Not specified';
      const salary = job.salary || job.compensation || 'Not provided';
      const desc = job.professionalJD || job.description || job.jobDescription || '';

      return `You are an interview preparation assistant. The user selected the following job card. Present a professional, concise summary of the role, highlight the top skills required, suggest 5 targeted interview questions (with brief sample answers), give three practical tips to prepare, and invite the user to ask follow-up questions.

Company: ${company}
Role: ${title}
Location: ${location}
Salary: ${salary}
Key skills: ${skills}
Description: ${desc}`;
    };

    const sendPrompt = async () => {
      const prompt = buildPrompt(selectedJob);
      setLoading(true);
      try {
        const res = await axios.post(
          'http://localhost:8080/api/chat',
          { prompt },
          { withCredentials: true }
        );

        const data = res.data || {};
        const aiText = data.response || data.ai || 'AI did not return a response.';

        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          name: 'Interview Prep AI',
          avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
          text: aiText,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('Failed to get AI response', err);
        const errMsg = {
          id: Date.now() + 2,
          sender: 'ai',
          name: 'Interview Prep AI',
          avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
          text: 'Sorry — I could not reach the AI service. Please try again later.',
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    };

    // clear previous messages and request a fresh AI response for the selected job
    setMessages([]);
    sendPrompt();
  }, [selectedJob]);

  // Send Message to AI
  const sendChat = async () => {
    if (!chat.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      name: authUser?.name,
      avatar: authUser?.profilePic,
      text: chat,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChat("");
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:8080/api/chat',
        { prompt: chat },
        { withCredentials: true }
      );

      const data = res.data || {};
      const aiText = data.response || data.ai || 'Let me help you with that. Can you elaborate?';

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        name: 'Interview Prep AI',
        avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
        text: aiText,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get AI response', err);
      const errMsg = {
        id: Date.now() + 2,
        sender: 'ai',
        name: 'Interview Prep AI',
        avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
        text: 'Sorry, I couldn\'t process that. Try again?',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      fixed top-16 right-0
      h-[calc(100vh-4rem)] w-[370px]
      bg-white/90 backdrop-blur-xl
      shadow-2xl border-l border-gray-300
      z-50 flex flex-col
    "
    >
      {/* Close Button */}
      <button
        onClick={() => setAiPannel(false)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <PanelLeftClose className="text-gray-500" size={20} />
      </button>

      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="font-semibold text-gray-700">Interview Prep AI Agent</h1>
      </div>

      {/* Chat Area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar (Left) */}
            {msg.sender === "ai" && (
              <img
                src={msg.avatar}
                className="w-9 h-9 rounded-full border shadow-sm object-cover"
              />
            )}

            {/* Bubble + Name */}
            <div className="max-w-[70%]">
              <p
                className={`text-xs mb-1 ${
                  msg.sender === "user"
                    ? "text-right text-gray-500"
                    : "text-gray-600"
                }`}
              >
                {msg.name}
              </p>

              <div
                className={`
                px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-blue-50 text-gray-800 rounded-bl-none border border-blue-200"
                }
              `}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>

            {/* User Avatar (Right) */}
            {msg.sender === "user" && (
              <img
                src={msg.avatar}
                className="w-9 h-9 rounded-full  object-cover"
              />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-end gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              className="w-9 h-9 rounded-full border shadow-sm"
            />
            <div className="px-3 py-2 bg-gray-200 text-gray-700 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader size={18} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 p-4 bg-white flex items-center gap-3">
        <label className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
          <Paperclip size={20} className="text-gray-600" />
          <input type="file" className="hidden" />
        </label>

        <input
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendChat()}
          type="text"
          placeholder="Ask your interview prep question..."
          disabled={loading}
          className="
            flex-1 px-3 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100
          "
        />

        <button
          onClick={sendChat}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
        >
          <SendHorizontal size={25} className={loading ? 'text-gray-300' : 'text-gray-600'} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
