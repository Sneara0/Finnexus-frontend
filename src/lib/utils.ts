
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS ক্লাস merge করার জন্য cn ফাংশন
 * @param inputs - Tailwind ক্লাস নাম
 * @returns merged ক্লাস নাম
 * 
 * @example
 * cn("bg-red-500", "hover:bg-red-600", "px-4")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * কারেন্সি ফরম্যাট করা (BDT)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * তারিখ ফরম্যাট করা
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * সময় ফরম্যাট করা
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * আপেক্ষিক সময় (যেমন: "২ দিন আগে")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'এখনই';
  if (diffMins < 60) return `${diffMins} মিনিট আগে`;
  if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
  if (diffDays < 7) return `${diffDays} দিন আগে`;
  
  return formatDate(date);
};

/**
 * শর্ট কারেন্সি ফরম্যাট (যেমন: 1.2K, 1.5M)
 */
export const formatShortCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toString();
};

/**
 * সংখ্যা ফরম্যাট করা (কমা সহ)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('bn-BD');
};

/**
 * পার্সেন্টেজ ফরম্যাট করা
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
