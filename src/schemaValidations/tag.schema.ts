import z from "zod";

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const UpdateTagSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
});

export const TagRes = z.object({
  data: z.array(TagSchema),
  message: z.string(),
});

export type TagType = z.TypeOf<typeof TagSchema>;
export type TagResType = z.TypeOf<typeof TagRes>;
export type CreateTagType = z.TypeOf<typeof CreateTagSchema>;
export type UpdateTagType = z.TypeOf<typeof UpdateTagSchema>;
