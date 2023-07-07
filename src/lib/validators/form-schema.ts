import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1),
});


export type FormType = z.infer<typeof FormSchema>;
