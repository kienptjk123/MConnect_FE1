import http from "@/lib/http";
import { z } from "zod";

export const VideoUploadRequestSchema = z.object({
  lessonId: z.number(),
  filename: z.string(),
  contentType: z.string(),
});

export const VideoUploadResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    uploadUrl: z.string(),
    key: z.string(),
    expiresIn: z.number(),
  }),
});

export type VideoUploadResponseType = z.TypeOf<
  typeof VideoUploadResponseSchema
>;

export type VideoUploadRequestType = z.TypeOf<typeof VideoUploadRequestSchema>;

const videoApiRequest = {
  getVideoUploadUrl: (body: VideoUploadRequestType) => {
    return http.post<VideoUploadResponseType>(
      "/courses/mentor/upload/video",
      body
    );
  },
};

export default videoApiRequest;
