#!/usr/bin/env deno
import { z } from "npm:zod";
import { encodePacked } from "npm:viem";
import { Bytes, EVMAddress, initializeHerdCodeServer } from "npm:@herd-labs/trails-code-framework";

function demonstrateEncodePacked({ address, description }: { address: `0x${string}`; description: string }): {
  encodedData: string;
} {
  return encodePacked(["address", "string"], [address, description]);
}

const inputSchema = z.object({
  address: EVMAddress,
  description: z.string(),
});

const outputSchema = z.object({
  encodedData: z.string(),
});

export default initializeHerdCodeServer(inputSchema, outputSchema, demonstrateEncodePacked);
