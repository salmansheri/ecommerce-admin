import { z } from "zod";

export const SizesSchema = z.object({
  name: z.string().min(1),
  value: z.string(),
});

export type SizesType = z.infer<typeof SizesSchema>;
