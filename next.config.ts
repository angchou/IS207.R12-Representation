import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt StrictMode để bộ đếm "số lần render" trong demo phản ánh đúng số lần render thật
  // (StrictMode ở chế độ dev cố ý gọi component 2 lần, làm bộ đếm bị nhân đôi).
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
