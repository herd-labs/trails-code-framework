# `@herd-labs/trails-code-framework`

A framework for building custom Code Nodes in Herd Trails. This package provides the tools and utilities needed to create Deno scripts that can transform data, make web requests, and perform custom logic within your Trail workflow.

## Installation

```typescript
// Use directly in your Herd Deno script
import { initializeHerdCodeServer, EVMAddress, Bytes } from "npm:@herd-labs/trails-code-framework";
```

## Quick Start
Below is an example Deno script that makes use of the Trails Code Framework:

```typescript
import { initializeHerdCodeServer } from "npm:@herd-labs/trails-code-framework";
import { z } from "npm:zod";

// Define your input and output schemas using Zod. These can be named anything, we currently do not support arrays or nested objects (tuples).
const inputSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const outputSchema = z.object({
  sum: z.number(),
});

// Create your main function (can be named anything, use z.infer to type your inputs/outputs)
async function handler(input: z.infer<typeof inputSchema>): Promise<z.infer<typeof outputSchema>> {
  return {
    sum: input.a + input.b,
  };
}

// This default export initializes the Trails Code Framework on Deno
export default initializeHerdCodeServer(inputSchema, outputSchema, handler);
```

## API Reference

### Core Functions

#### `initializeHerdCodeServer(inputSchema, outputSchema, handler)`

Creates a validated HTTP endpoint with automatic request/response validation.

**Parameters:**
- `inputSchema`: Zod schema for input validation
- `outputSchema`: Zod schema for output validation
- `handler`: Function that processes the validated input and returns the output

**Returns:** Herd-compliant code ready for use in a Trail!

## License

TBD
