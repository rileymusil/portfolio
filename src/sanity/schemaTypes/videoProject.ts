import { defineArrayMember, defineField, defineType } from "sanity";
import { parseVideoUrl, VIDEO_URL_HELP } from "@/lib/video-embed";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";
import { VideoThumbnailInput } from "@/sanity/components/VideoThumbnailInput";
import { richTextMembers } from "@/sanity/schemaTypes/richText";

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
      name: "videoUrl",
      title: "Video link",
      type: "string",
      description: VIDEO_URL_HELP,
      validation: (rule) =>
        rule.custom((value, context) => {
          /* Documents created before multi-platform support have no videoUrl;
             they stay valid on their youtubeId until someone edits them. */
          const legacyId = (
            context.document as { youtubeId?: unknown } | undefined
          )?.youtubeId;
          if (!value) {
            return typeof legacyId === "string" && legacyId.trim()
              ? true
              : "Add the video's link.";
          }
          return parseVideoUrl(value)
            ? true
            : "That link isn't one this site can embed. " + VIDEO_URL_HELP;
        }),
    }),
    defineField({
      name: "thumbnail",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      components: { input: VideoThumbnailInput },
      description:
        "Vimeo and TikTok can be fetched automatically. Facebook and Instagram publish no thumbnail, " +
        "so capture a frame from the source video or upload an image. YouTube and Google Drive already " +
        "have one; anything set here overrides it.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube video ID (legacy)",
      type: "string",
      readOnly: true,
      description:
        "Kept so projects added before multi-platform support keep playing. Paste the full link into Video link above and this can be cleared.",
      hidden: ({ document }) => !document?.youtubeId,
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
      of: richTextMembers,
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
      media: "thumbnail",
      fallbackMedia: "stills.0",
    },
    prepare({ title, category, media, fallbackMedia }) {
      return {
        title: title as string,
        subtitle: String(category ?? ""),
        media: media ?? fallbackMedia,
      };
    },
  },
});
