"use client";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}