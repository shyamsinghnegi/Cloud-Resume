/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",             // static HTML export -> ./out (served by Azure SWA)
  reactCompiler: true,
  images: { unoptimized: true } // required for static export if next/image is ever used
};

export default nextConfig;
