import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const storageKey = (userId) => `chat_messages_${userId}`;

export const useChatStore = create((set, get) => ({
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,

  loadInitialUser: () => {
    const authUser = useAuthStore.getState().authUser;
    if (authUser) {
      const id = authUser._id || authUser.id || "me";
      set({ selectedUser: id });
      // load messages for this user
      get().loadMessages(id);
    } else {
      // fallback to a default agent id so chat UI isn't empty
      const fallback = "agent";
      set({ selectedUser: fallback });
      get().loadMessages(fallback);
    }
  },

  loadMessages: (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const raw = localStorage.getItem(storageKey(userId));
      const msgs = raw ? JSON.parse(raw) : [];
      set({ messages: msgs });
    } catch (err) {
      console.error("Failed to load messages", err);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  saveMessagesToStorage: (userId, msgs) => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(msgs));
    } catch (err) {
      console.error("Failed to save messages", err);
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) {
      toast.error("No user selected to chat");
      return;
    }

    // Create a local message object
    const newMsg = {
      id: Date.now().toString(),
      text: messageData.text || null,
      image: messageData.image || null,
      sender: "me",
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    const updated = [...messages, newMsg];
    set({ messages: updated });
    get().saveMessagesToStorage(selectedUser, updated);

    // Try to send to backend (best-effort). Backend endpoint is `/send/:id` under base `/api`.
    try {
      const res = await axiosInstance.post(`/send/${selectedUser}`, messageData);
      // mark message as sent if request succeeded
      const nowUpdated = get().messages.map((m) =>
        m.id === newMsg.id ? { ...m, status: 'sent' } : m
      );
      set({ messages: nowUpdated });
      get().saveMessagesToStorage(selectedUser, nowUpdated);

      // Optionally, if backend returns a created message, we could replace it here.
      if (res?.data && typeof res.data === 'object') {
        // no-op for now — backend returns a placeholder response
      }
    } catch (error) {
      // mark message as failed
      const failedUpdated = get().messages.map((m) =>
        m.id === newMsg.id ? { ...m, status: 'failed' } : m
      );
      set({ messages: failedUpdated });
      get().saveMessagesToStorage(selectedUser, failedUpdated);
      toast.error(error?.response?.data?.message || "Failed to deliver message to server");
      console.warn("Backend send failed, message saved locally", error);
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    // load messages for newly selected user
    get().loadMessages(selectedUser);
  },
}));
