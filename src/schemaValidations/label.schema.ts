import { z } from "zod";

// Label Schema
export const LabelSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Label Create Schema
export const LabelCreateSchema = z.object({
  name: z.string().min(1, "Label name is required"),
});

// Label Update Schema
export const LabelUpdateSchema = z.object({
  name: z.string().min(1, "Label name is required"),
});

// API Response Schemas
export const LabelCreateResponseSchema = z.object({
  message: z.string(),
  data: LabelSchema,
});

export const LabelUpdateResponseSchema = z.object({
  message: z.string(),
  data: LabelSchema,
});

export const LabelsResponseSchema = z.object({
  message: z.string(),
  data: z.array(LabelSchema),
});

export const LabelDeleteResponseSchema = z.object({
  message: z.string(),
});

// TypeScript Types
export type LabelType = z.TypeOf<typeof LabelSchema>;
export type LabelCreateType = z.TypeOf<typeof LabelCreateSchema>;
export type LabelUpdateType = z.TypeOf<typeof LabelUpdateSchema>;
export type LabelCreateResponseType = z.TypeOf<
  typeof LabelCreateResponseSchema
>;
export type LabelUpdateResponseType = z.TypeOf<
  typeof LabelUpdateResponseSchema
>;
export type LabelsResponseType = z.TypeOf<typeof LabelsResponseSchema>;
export type LabelDeleteResponseType = z.TypeOf<
  typeof LabelDeleteResponseSchema
>;
