import type { NextConfig } from "next";
import { getStaticExportOptions } from "./src/lib/static-export";

const staticExport = getStaticExportOptions();

const nextConfig: NextConfig = {
  output: staticExport.output,
  trailingSlash: staticExport.trailingSlash,
  basePath: staticExport.basePath,
  transpilePackages: ["sanity", "next-sanity", "@sanity/vision"],
  images: {
    loader: staticExport.images.loader,
    loaderFile: staticExport.images.loaderFile,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
