import { expect, describe, it } from "bun:test";
import { z } from "zod";
import { initializeHerdCodeServer } from "./index";

describe("Herd Code Server Framework", () => {
  describe("initializeHerdCodeServer", () => {
    describe("when creating a Hono server", () => {
      it("should return a Hono app that processes POST requests correctly", async () => {
        const inputSchema = z.object({
          name: z.string(),
          age: z.number(),
        });

        const outputSchema = z.object({
          greeting: z.string(),
          isAdult: z.boolean(),
        });

        const app = initializeHerdCodeServer(inputSchema, outputSchema, (input) => ({
          greeting: `Hello, ${input.name}!`,
          isAdult: input.age >= 18,
        }));

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "John", age: 25 }),
        });

        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
          greeting: "Hello, John!",
          isAdult: true,
        });
      });

      it("should handle different input/output types", async () => {
        const inputSchema = z.object({
          value: z.number(),
        });

        const outputSchema = z.object({
          result: z.string(),
        });

        const app = initializeHerdCodeServer(inputSchema, outputSchema, (input) => ({
          result: `Value is: ${input.value}`,
        }));

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: 42 }),
        });

        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({ result: "Value is: 42" });
      });
    });

    describe("when validating input", () => {
      it("should return 400 for invalid input types", async () => {
        const inputSchema = z.object({
          number: z.number(),
        });

        const outputSchema = z.object({
          result: z.string(),
        });

        const app = initializeHerdCodeServer(inputSchema, outputSchema, (input) => ({
          result: input.number.toString(),
        }));

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: "not a number" }),
        });

        expect(response.status).toBe(400);
      });

      it("should return 400 for missing required fields", async () => {
        const inputSchema = z.object({
          required: z.string(),
          optional: z.string().optional(),
        });

        const outputSchema = z.object({
          result: z.string(),
        });

        const app = initializeHerdCodeServer(inputSchema, outputSchema, (input) => ({ result: input.required }));

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ optional: "present" }),
        });

        expect(response.status).toBe(400);
      });
    });

    describe("when validating output", () => {
      it("should return 500 when function returns invalid output type", async () => {
        const inputSchema = z.object({
          input: z.string(),
        });

        const outputSchema = z.object({
          result: z.number(),
        });

        const app = initializeHerdCodeServer(
          inputSchema,
          outputSchema,
          () => ({ result: "not a number" }) as any, // This should fail output validation
        );

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "test" }),
        });

        expect(response.status).toBe(500);
      });

      it("should return 500 when function returns incomplete output object", async () => {
        const inputSchema = z.object({
          input: z.string(),
        });

        const outputSchema = z.object({
          required: z.string(),
          alsoRequired: z.number(),
        });

        const app = initializeHerdCodeServer(
          inputSchema,
          outputSchema,
          () => ({ required: "present" }) as any, // Missing alsoRequired
        );

        const response = await app.request("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "test" }),
        });

        expect(response.status).toBe(500);
      });
    });
  });
});
