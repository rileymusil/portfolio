import { defineArrayMember, defineField } from "sanity";

/* Shared Portable Text definition, used by every rich-text field in the Studio
   so the link annotation behaves identically everywhere. Styles are deliberately
   narrow: the pages style paragraphs and lists only, so offering headings here
   would let the Studio produce markup that has no styling on the site. */
export const richTextMembers = [
  defineArrayMember({
    type: "block",
    styles: [{ title: "Paragraph", value: "normal" }],
    lists: [
      { title: "Bulleted", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in a new tab",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    },
  }),
];
