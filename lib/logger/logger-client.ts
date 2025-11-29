const loggerClient = {
  error: (message: string, context?: object) => {
    console.error(message, context);
    // Optionally send to external service in production
  },
  info: (message: string, context?: object) => {
    console.info(message, context);
  },
  warn: (message: string, context?: object) => {
    console.warn(message, context);
  },
  debug: (message: string, context?: object) => {
    console.debug(message, context);
  },
};

export default loggerClient;