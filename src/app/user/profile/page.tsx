

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Camera, Save, 
  Lock, Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";
import { userService } from "@/app/services/user.service";


const profileSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড প্রয়োজন"),
  newPassword: z.string().min(6, "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { register: registerProfile, handleSubmit: handleProfileSubmit, setValue, formState: { errors: profileErrors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      const userData = response.data.user;
      setUser(userData);
      setValue("name", userData.name);
      setValue("phone", userData.phone || "");
      setValue("address", userData.address || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (data: ProfileValues) => {
    setUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      await userService.updateMyProfile(data);
      setSuccessMessage("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      await loadUserProfile();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  const onChangePassword = async (data: PasswordValues) => {
    setChangingPassword(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccessMessage("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
      resetPassword();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your personal information and security</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-200">{successMessage}</p>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-200">{errorMessage}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...registerProfile("name")}
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
              {profileErrors.name && (
                <p className="text-red-400 text-xs mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...registerProfile("phone")}
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
              {profileErrors.phone && (
                <p className="text-red-400 text-xs mt-1">{profileErrors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  {...registerProfile("address")}
                  rows={3}
                  placeholder="Your address"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none resize-none"
                />
              </div>
              {profileErrors.address && (
                <p className="text-red-400 text-xs mt-1">{profileErrors.address.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Lock className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...registerPassword("currentPassword")}
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...registerPassword("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...registerPassword("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full py-2.5 bg-orange-600 rounded-xl text-white font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {changingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Changing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
