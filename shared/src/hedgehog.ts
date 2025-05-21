import { z } from "zod";

/**
 * Hedgehog interface shared between server and client
 */

const sex = ["Male", "Female", "Unknown"] as const;

const locationSchema = z.object({
  lon: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export const hedgehogSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
  age: z.number().nullish(),
  gender: z.enum(sex),
  location: locationSchema,
});

export type Hedgehog = z.infer<typeof hedgehogSchema>;
