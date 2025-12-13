    import { create } from "zustand";
    import { axiosInstance } from "../lib/axios";
    import toast from "react-hot-toast";
  


    export const useAuthStore = create((set, get) => ({
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isChekingAuth: true,

        checkAuth: async () => {
            try {
                const res = await axiosInstance.get("/check");
                set({ authUser: res.data });
            } catch (error) {
                console.log("error in checkAuth: ", error);
                set({ authUser: null });
            } finally {
                set({ isChekingAuth: false });
            }
        },

        signup: async (data) => {
            set({ isSigningUp: true });
            try {
                const res = await axiosInstance.post("/signup", data);
                set({ authUser: res.data });
                toast.success("Account created successfully");
            } catch (error) {
                toast.error(error?.response?.data?.message || "Signup failed");
            } finally {
                set({ isSigningUp: false });
            }
        },

        login: async (data) => {
            set({ isLoggingIn: true });
            try {
                const res = await axiosInstance.post("/login", data);
                set({ authUser: res.data });
                toast.success("Logged in successfully");
            } catch (error) {
                toast.error(error?.response?.data?.message || "Login failed");
            } finally {
                set({ isLoggingIn: false });
            }
        },

        logout: async () => {
            try {
                await axiosInstance.post("/logout");
                set({ authUser: null });
                toast.success("Logged out successfully");
            } catch (error) {
                toast.error(error?.response?.data?.message || "Logout failed");
            }
        },

        updateProfile: async (data) => {
            set({ isUpdatingProfile: true });
            try {
                const res = await axiosInstance.put("/update-profile", data);
                set({ authUser: res.data });
                toast.success("Profile updated successfully");
            } catch (error) {
                toast.error(error?.response?.data?.message || "Update failed");
            } finally {
                set({ isUpdatingProfile: false });
            }
        },

    }));
