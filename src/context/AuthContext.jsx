import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session
  const checkAuth = async () => {
    try {
      const res = await api.get("/users/me");
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/users/login", { username, password });
      if (res.data?.success) {
        setUser(res.data.user);
        toast.success(res.data.message || "Logged in successfully!");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await api.post("/users/signup", {
        username,
        email,
        password,
      });
      if (res.data?.success) {
        setUser(res.data.user);
        toast.success("Welcome to StaySphere! Account created.");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to sign up";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch {
      setUser(null);
      toast.success("Logged out");
    }
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      toast.error("Please log in to save to your wishlist");
      return false;
    }
    try {
      const res = await api.post(`/users/wishlist/${listingId}`);
      if (res.data?.success) {
        setUser((prev) => ({
          ...prev,
          wishlist: res.data.wishlist,
        }));
        if (res.data.isSaved) {
          toast.success("Saved to your wishlist!");
        } else {
          toast.success("Removed from wishlist");
        }
        return res.data.isSaved;
      }
    } catch {
      toast.error("Failed to update wishlist");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        checkAuth,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
