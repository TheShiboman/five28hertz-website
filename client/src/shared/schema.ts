import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  logoUrl: z.string().optional(),
  category: z.string(),
  technologies: z.array(z.string()),
  link: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export type Project = z.infer<typeof projectSchema>;
