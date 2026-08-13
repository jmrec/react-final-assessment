import { z, ZodNumber } from "zod";

export const menuFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce
    .number("Price must be a number")
    .gt(0, "Price must be greater than 0") as ZodNumber,
  available: z.boolean("Specify if available"),
});

export type MenuFormData = z.infer<typeof menuFormSchema>;
