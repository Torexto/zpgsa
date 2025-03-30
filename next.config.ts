import { NextConfig } from "next";
import nextPWA from "next-pwa";

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

const pwaConfig = nextPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
});

export default { ...nextConfig, ...pwaConfig };