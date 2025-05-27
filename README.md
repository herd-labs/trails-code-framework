# @herd-labs/trails-code-framework

A package for building Herd-compliant custom Deno scripts used in Herd Trails.

## Installation

```bash
# Use directly in your Herd Deno script
import { initializeHerdCodeServer, EVMAddress, Bytes } from "npm:@herd-labs/trails-code-framework";
```

## Quick Start

```typescript
import { z } from "npm:zod";
import { initializeHerdCodeServer, EVMAddress } from "npm:@herd-labs/trails-code-framework";

// Define your input and output schemas
const inputSchema = z.object({
  address: EVMAddress,
  amount: z.number(),
  data: z.string(),
});

const outputSchema = z.object({
  success: z.boolean(),
  transactionHash: z.string(),
  gasUsed: z.number(),
});

// Create your business logic function
function processTransaction(input: z.infer<typeof inputSchema>) {
  // Your logic here
  return {
    success: true,
    transactionHash: "0x1234...",
    gasUsed: 21000,
  };
}

// Initialize and export your server
export default initializeHerdCodeServer(inputSchema, outputSchema, processTransaction);
```

## API Reference

### Core Functions

#### `initializeHerdCodeServer(inputSchema, outputSchema, handler)`

Creates a validated HTTP endpoint with automatic request/response validation.

**Parameters:**
- `inputSchema`: Zod schema for request validation
- `outputSchema`: Zod schema for response validation
- `handler`: Function that processes the validated input and returns the output

**Returns:** Herd-compliant code ready for use in a Trail!

## License

TBD
