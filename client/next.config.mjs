/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "xsgames.co" },
      { hostname: "files.edgestore.dev" },
      { hostname: "thumbs.dreamstime.com" },
      { hostname: "cdn.pixabay.com" },
      { hostname: "images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com" },
    ],
  },
};

export default nextConfig;
