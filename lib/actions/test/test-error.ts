// app/actions/test-error.ts
"use server";

import z from "zod";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger/logger";

export async function testErrorAction() {
  try {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      username: z.string().min(3),
    });

    userSchema.parse({
      email: "invalid-email",
      password: "123",
    });

    return { success: true };
  } catch (error: unknown) {
    const formattedError = handleError(error);
    logger.error({ formattedError }, "Request failed in server action");
    return formattedError;
  }
}
