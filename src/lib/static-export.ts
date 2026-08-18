export interface StaticExportOptions {
  output: "export";
  trailingSlash: true;
  basePath: string;
  images: {
    unoptimized: true;
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
      unoptimized: true,
    },
  };
}
