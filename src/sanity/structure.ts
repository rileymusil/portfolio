import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { StructureResolver } from "sanity/structure";
import { ABOUT_PAGE_ID } from "@/sanity/schemaTypes/aboutPage";
import { VIDEO_CATEGORIES, getVideoCategoryMeta } from "@/lib/video";

/* Video projects are split into one orderable list per category, because a
   drag-to-reorder list can only order the documents it shows, and the two
   categories are separate pages on the site. Photo sessions stay an ordinary
   list. The About page is a singleton, so it opens straight into the one
   document instead of a list with a "create new" button that would only ever
   produce an unused second copy. */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("photoSession").title("Photo Sessions"),
      S.divider(),
      ...VIDEO_CATEGORIES.map((category) =>
        orderableDocumentListDeskItem({
          type: "videoProject",
          title: `${getVideoCategoryMeta(category).shortLabel} Video`,
          /* Distinct per list, as the plugin requires when one type appears
             more than once. */
          id: `orderable-video-${category}`,
          filter: "category == $category",
          params: { category },
          S,
          context,
        }),
      ),
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
