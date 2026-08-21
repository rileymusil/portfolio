import { defineField, defineType } from "sanity";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";

export const photoSessionType = defineType({
  name: "photoSession",
  title: "Photo Session",
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
          { title: "Portraits", value: "portraits" },
          { title: "Event", value: "event" },
          { title: "Creative", value: "creative" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      description:
        "Large photos are resized to 2400px on the long edge when uploaded.",
      options: { hotspot: true },
      components: { input: CompressedImageInput },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photos",
      title: "Gallery photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          components: { input: CompressedImageInput },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "cover",
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
