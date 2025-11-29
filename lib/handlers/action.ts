"use server";

import { headers } from "next/headers";
import z, { ZodError, type ZodType } from "zod";
import { auth } from "@/lib//auth";
import { UnauthorizedError, ValidationError } from "../http-error";
import logger from "../logger/logger";
import handleError from "./error";

type ActionOptions<T> = {
  params: T;
  schema: ZodType<T>;
  authorize?: boolean;
};

export async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = handleError(error);
        logger.error({ formattedError }, "Zod Error In Server Action");
        return new ValidationError(z.flattenError(error).fieldErrors);
      } else {
        return new Error("Schema validation failed");
      }
    }

    if (authorize) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        return new UnauthorizedError("User Unauthorized");
      }
    }

    return { params, schema };
  }
}
