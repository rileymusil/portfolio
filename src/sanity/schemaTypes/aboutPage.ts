import { defineArrayMember, defineField, defineType } from "sanity";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";
import { richTextMembers } from "@/sanity/schemaTypes/richText";

/* Singleton: exactly one of these exists, at the fixed ID below. The Studio
   structure in sanity.config.ts opens it directly rather than showing a list,
   and ABOUT_PAGE_ID is what the site queries for. */
export const ABOUT_PAGE_ID = "aboutPage";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "skills", title: "Skills & Experience" },
    { name: "photos", title: "Photos" },
    { name: "personal", title: "Education & Personal" },
  ],
  fields: [
    defineField({
      name: "bannerTitle",
      title: "Banner heading",
      type: "string",
      group: "intro",
      initialValue: "About Me",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bannerSubtitle",
      title: "Banner subheading",
      type: "string",
      group: "intro",
      description:
        "Also used as the page's search-engine description, so keep it under about 160 characters.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "role",
      title: "Role badge",
      type: "string",
      group: "intro",
      description: "The pill under your name, e.g. Live Event Coverage Specialist.",
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      group: "intro",
      options: { hotspot: true },
      components: { input: CompressedImageInput },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "intro",
      title: "Intro paragraphs",
      type: "array",
      group: "intro",
      description:
        "Select any text and use the link button in the toolbar to turn it into a link.",
      of: richTextMembers,
    }),
    defineField({
      name: "skillGroups",
      title: "Skill groups",
      type: "array",
      group: "skills",
      of: [
        defineArrayMember({
          type: "object",
          name: "skillGroup",
          fields: [
            defineField({
              name: "title",
              title: "Group title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tags",
              title: "Tags",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { layout: "tags" },
            }),
          ],
          preview: {
            select: { title: "title", tags: "tags" },
            prepare({ title, tags }) {
              const list = Array.isArray(tags) ? tags : [];
              return {
                title: title as string,
                subtitle: `${list.length} tag${list.length === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      group: "skills",
      description: "Listed top to bottom in the order below.",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceItem",
          fields: [
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "organization",
              title: "Organization",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              description: "Free text, e.g. Sept 2023 – Present.",
            }),
            defineField({
              name: "bullets",
              title: "Bullet points",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "role", subtitle: "organization" },
          },
        }),
      ],
    }),
    defineField({
      name: "fieldPhotos",
      title: "In the field photos",
      type: "array",
      group: "photos",
      description: "Shown three across. Large photos are resized on upload.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          components: { input: CompressedImageInput },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "object",
      group: "personal",
      fields: [
        defineField({
          name: "title",
          title: "Qualification",
          type: "string",
        }),
        defineField({
          name: "school",
          title: "School",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "honors",
      title: "Honors & activities",
      type: "array",
      group: "personal",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "hobbies",
      title: "Hobbies & interests",
      type: "array",
      group: "personal",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { title: "bannerTitle", subtitle: "bannerSubtitle", media: "headshot" },
  },
});
