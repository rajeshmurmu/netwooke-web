import z from "zod";
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File is required")
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 20MB")
  .refine(
    (file) =>
      [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "audio/mpeg",
      ].includes(file.type),
    "Unsupported file type",
  );

const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
  mediaType: z.enum(["audio", "video", "image", "none"]).default("none"),
  media: fileSchema.nullable().optional(),
  visibility: z.enum(["public", "group", "private"]).default("public"),
  tags: z.array(z.string()).optional(),
});

export type PostInput = z.infer<typeof postSchema>;

export default postSchema;
