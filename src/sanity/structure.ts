import type { StructureResolver } from "sanity/structure";
import { ABOUT_PAGE_ID } from "@/sanity/schemaTypes/aboutPage";

/* Photo sessions and video projects are ordinary lists. The About page is a
   singleton, so it opens straight into the one document instead of a list with
   a "create new" button that would only ever produce an unused second copy. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("photoSession").title("Photo Sessions"),
      S.documentTypeListItem("videoProject").title("Video Projects"),
      S.divider(),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId(ABOUT_PAGE_ID)
            .title("About Page"),
        ),
    ]);
