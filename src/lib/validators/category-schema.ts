import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1),
  billboardId: z.string(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
