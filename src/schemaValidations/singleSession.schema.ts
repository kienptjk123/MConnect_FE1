import z from "zod";

export const SingleSessionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  topic: z.string(),
  price: z.number(),
  status: z.enum(["SHOW", "NO_SHOW", "ADVANCED"]),
  mentorProfileId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SingleSessionRes = z.array(SingleSessionSchema);

export const SingleSessionCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  topic: z.string().min(1, "Topic is required"),
  price: z.number().min(0, "Price must be a positive number"),
  status: z.enum(["SHOW", "NO_SHOW", "ADVANCED"]).default("SHOW"),
});

export const SingleSessionUpdateSchema = SingleSessionCreateSchema.partial();

export type SingleSessionType = z.TypeOf<typeof SingleSessionSchema>;
export type SingleSessionResType = z.TypeOf<typeof SingleSessionRes>;
export type SingleSessionCreateType = z.TypeOf<
  typeof SingleSessionCreateSchema
>;
export type SingleSessionUpdateType = z.TypeOf<
  typeof SingleSessionUpdateSchema
>;
