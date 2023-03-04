import { defineCollection, z } from "astro:content";

/** Tags */
const TagSchema = z.union([
  z.literal("JavaScript"),
  z.literal("Animation"),
  z.literal("CSS"),
  z.literal("Goody"),
  z.literal("Tutorial"),
]);

export type Tag = z.infer<typeof TagSchema>;

/** Things Collection */
export const collections = {
  things: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      draft: z.boolean().optional(),
      date: z.string().optional(),
      tags: z.array(TagSchema),
    }),
  }),
};
