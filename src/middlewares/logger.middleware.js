import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = ` \n  ${new Date().toString()}  - Log Data: ${logData} `;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (err) {
//     console.log(err);
//   }
// }

async function log(logData) {
  try {
    logData = ` \n  ${new Date().toString()} \n ${logData} \n `;
    await fsPromise.appendFile("logs.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

export { log };

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, res, next) => {
  // 1. log request body
  if (!req.url.includes("signin")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    // await log(logData);
    logger.info(logData);
  }

  next();
};

export default loggerMiddleware;
