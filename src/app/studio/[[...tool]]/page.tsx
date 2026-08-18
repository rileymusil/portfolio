import { Studio } from "./Studio";

export { metadata, viewport } from "next-sanity/studio";

export function generateStaticParams(): Array<{ tool: string[] }> {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <Studio />;
}
