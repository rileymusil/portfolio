export interface StaticExportOptions {
  output: "export";
  trailingSlash: true;
  basePath: string;
  images: {
    loader: "custom";
    loaderFile: string;
  };
}

export function getBasePath(
  env: Record<string, string | undefined> = process.env,
): string {
  const raw = env.NEXT_PUBLIC_BASE_PATH ?? "";
  const trimmed = raw.replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed ? `/${trimmed}` : "";
}

export function getStaticExportOptions(
  env: Record<string, string | undefined> = process.env,
): StaticExportOptions {
  return {
    output: "export",
    trailingSlash: true,
    basePath: getBasePath(env),
    images: {
      // Next's own optimizer needs a server, so a static export routes resizing
      // through Sanity's image CDN instead of shipping originals.
      loader: "custom",
      loaderFile: "./src/lib/sanity/image-loader.ts",
    },
  };
}
