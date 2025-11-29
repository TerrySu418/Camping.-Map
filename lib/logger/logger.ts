import pino from "pino";

// lib/logger.ts
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
          formatters: {
            level: "(label) => ({ level: label.toUpperCase() })",
          },
        },
      },
    ],
  },
});

export default logger