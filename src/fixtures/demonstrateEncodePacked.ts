#!/usr/bin/env deno
import { z } from "npm:zod";
import { encodePacked } from "npm:viem";
import { Bytes, EVMAddress, initializeHerdCodeServer } from "npm:@herd-labs/trails-code-framework";

/**
 * Demonstrates the usage of encodePacked with dummy data
 * @returns The packed encoded data as a hex string
 */
function demonstrateEncodePacked({
  address,
  stringData,
  bytesArray,
}: {
  address: `0x${string}`;
  stringData: string;
  bytesArray: Array<`0x${string}`>;
}): { encodedData: string } {
  // Encode the data using encodePacked
  const encodedData = encodePacked(["address", "string", "bytes16[]"], [address, stringData, bytesArray]);

  return { encodedData };
}

const inputSchema = z.object({
  address: EVMAddress,
  stringData: z.string(),
  bytesArray: z.array(Bytes(32)),
});

const outputSchema = z.object({
  encodedData: z.string(),
});

export default initializeHerdCodeServer(inputSchema, outputSchema, demonstrateEncodePacked);
