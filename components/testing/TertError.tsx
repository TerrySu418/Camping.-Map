import z from "zod";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger/logger";

const TestError = () => {
  console.log("Testing error classes...");

  try {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      username: z.string().min(3),
    });

    // This will throw a ZodError
    userSchema.parse({
      email: "invalid-email",
      password: "123", // too short
      // username is missing
    });
  } catch (error: unknown) {
    const formattedErrror = handleError(error);
    logger.info(formattedErrror, "Formatting Error");
  }
  return (
    <>
      <h1>Testing Error Classes</h1>
      <p>Check your browser console (F12) to see the output</p>
    </>
  );
};

export default TestError;
