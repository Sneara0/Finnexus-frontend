import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // আপনার ব্যাকেন্ড ইউআরএল

// Register API
export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login API
export const loginUser = async (credentials: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    // যদি লগইন সফল হয় এবং টোকেন আসে, তবে তা ব্রাউজারে সেভ করার জন্য:
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    // এরর হ্যান্ডলিং যাতে আপনি ফ্রন্টএন্ডে মেসেজ দেখাতে পারেন
    throw error.response?.data || new Error("Login failed");
  }
};