import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";

export const EVMAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/)
  .transform((val) => val as `0x${string}`);
export const EVMTxHash = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/)
  .transform((val) => val as `0x${string}`);
export const Bytes = (length: number) =>
  z
    .string()
    .regex(new RegExp(`^0x[a-fA-F0-9]{${length}}$`))
    .transform((val) => val as `0x${string}`);

// Function that creates a Hono server with typed validation
export function initializeHerdCodeServer<TInputSchema extends z.ZodObject<any>, TOutputSchema extends z.ZodObject<any>>(
  inputSchema: TInputSchema,
  outputSchema: TOutputSchema,
  fn: (input: z.infer<TInputSchema>) => z.infer<TOutputSchema>,
) {
  const app = new Hono();
  app.use("/*", cors());

  app.post("/", zValidator("json", inputSchema), async (c) => {
    try {
      const validatedInput = c.req.valid("json");

      // Execute the function
      const result = fn(validatedInput);

      // Validate output
      const validatedOutput = outputSchema.parse(result);

      return c.json(validatedOutput);
    } catch (error) {
      console.error("Server error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  });

  return app;
}
