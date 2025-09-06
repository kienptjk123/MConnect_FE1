import z from "zod";

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export const TagRes = z.object({
  data: z.array(TagSchema),
  message: z.string(),
});

export type TagType = z.TypeOf<typeof TagSchema>;
export type TagResType = z.TypeOf<typeof TagRes>;
