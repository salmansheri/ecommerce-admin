import { z } from "zod";

export const ColorsSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String Must be a valid hex code",
  }),
});

export type ColorsType = z.infer<typeof ColorsSchema>;
