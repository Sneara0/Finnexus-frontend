import axios from "axios";

// ১. API_URL একবারই ডিক্লেয়ার করুন
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ২. Axios instance তৈরি করুন (এটি প্রফেশনাল পদ্ধতি)
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
    // এখানে আপনার স্ক্রিনশটে দুইবার response ছিল, আমি একটি করে দিয়েছি
    const response = await api.post("/auth/login", credentials);
    
    // যদি লগইন সফল হয় এবং টোকেন আসে
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Login failed");
  }
};