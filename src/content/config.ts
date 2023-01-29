import { defineCollection, z } from "astro:content";

/** Blog Collection */
const TagSchema = z.union([
  z.literal("JavaScript"),
  z.literal("Animations"),
]);
export type Tag = z.infer<typeof TagSchema>;

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    tags: z.array(TagSchema),
  }),
});

/** Things Collection */
const thingsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
  }),
});

/** Export all collections */
export const collections = {
  blog: blogCollection,
  things: thingsCollection,
};
