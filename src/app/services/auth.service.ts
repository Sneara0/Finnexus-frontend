import axios from "axios";

// ✅ লোকাল এবং ডেপ্লয়মেন্ট উভয় জায়গার জন্য ডাইনামিক ইউআরএল
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Axios Instance তৈরি (এটি করলে কোড আরও ক্লিন হয়)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register API
export const registerUser = async (userData: any) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed");
  }
};

// Login API
export const loginUser = async (credentials: any) => {
  try {
    const response = await api.post("/auth/login", credentials);
    
    // টোকেন এবং ইউজার ডেটা সেভ করা
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      // প্রয়োজন হলে ইউজার ইনফোও সেভ করতে পারেন
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    // ব্যাকেন্ড থেকে আসা নির্দিষ্ট এরর মেসেজটি থ্রো করা
    throw error.response?.data || new Error("Login failed");
  }
};