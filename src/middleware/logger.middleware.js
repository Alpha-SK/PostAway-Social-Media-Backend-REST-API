import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "logs.log" })],
});

export const logger1 = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

const loggerMiddleware = async (req, res, next) => {
  // 1. Log request body
  const logData = `(Timestamp: ${new Date().toString()}) -- (request Url: ${
    req.url
  }) -- (${JSON.stringify(req.body)})`;
  logger.info(logData);

  next();
};

export default loggerMiddleware;
