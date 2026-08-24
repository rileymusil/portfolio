import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "riley-musil",
  title: "Riley Musil Portfolio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    /* The About page is a singleton reached through the structure above.
       Hide the actions that would create or delete a second copy. */
    actions: (prev, { schemaType }) =>
      schemaType === "aboutPage"
        ? prev.filter(
            (action) =>
              !["duplicate", "delete", "unpublish"].includes(
                String(action.action),
              ),
          )
        : prev,
  },
});
