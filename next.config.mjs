// // 原本配置
// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// 允許從TMDB載入的圖片
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
