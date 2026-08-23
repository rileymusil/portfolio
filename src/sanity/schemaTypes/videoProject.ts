import { defineArrayMember, defineField, defineType } from "sanity";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export const videoProjectType = defineType({
  name: "videoProject",
  title: "Video Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Narrative", value: "narrative" },
          { title: "Commercial", value: "commercial" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube video ID",
      type: "string",
      description:
        "Just the 11-character ID, not the whole URL. In https://youtu.be/YqYoziZZlg8 the ID is YqYoziZZlg8.",
      validation: (rule) =>
        rule
          .required()
          .regex(YOUTUBE_ID, {
            name: "YouTube ID",
            invert: false,
          })
          .error("Enter the 11-character video ID on its own, without the URL around it."),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "badges",
      title: "Role badges",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Short credits, e.g. Camera Operator, Director, Editor.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      description:
        "Select any text and use the link button in the toolbar to turn it into a link.",
      of: [
        defineArrayMember({
          type: "block",
          /* Deliberately narrow: the modal styles paragraphs and lists only, so
             offering headings here would let the Studio produce markup the page
             has no styling for. */
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
      ],
    }),
    defineField({
      name: "stills",
      title: "Behind-the-scenes stills",
      type: "array",
      description:
        "Large photos are resized to 2400px on the long edge when uploaded.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          components: { input: CompressedImageInput },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "stills.0",
    },
    prepare({ title, category, media }) {
      return {
        title: title as string,
        subtitle: String(category ?? ""),
        media,
      };
    },
  },
});
