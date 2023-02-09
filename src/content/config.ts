import { defineCollection, z } from "astro:content";

/** Blog Collection */
const TagSchema = z.union([
  z.literal("JavaScript"),
  z.literal("Animation"),
  z.literal("CSS"),
  z.literal("Goody"),
  z.literal("Tutorial"),
]);
export type Tag = z.infer<typeof TagSchema>;

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    date: z.string().optional(),
    tags: z.array(TagSchema),
  }),
});

/** Things Collection */
const thingsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    date: z.string().optional(),
    tags: z.array(TagSchema),
  }),
});

/** Export all collections */
export const collections = {
  blog: blogCollection,
  things: thingsCollection,
};
