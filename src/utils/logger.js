const pino = require("pino");

//CREATE TRANSPORT for multiple transport
const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: {
        destination: "./logs/output.log",
        mkdir: true,
        translateTime: "SYS:dd-mm-yyyy hh-mm-ss",
        ignore: "pid,hostname",
        colorize: false,
      },
    },
    {
      target: "pino-pretty",
      options: {
        destination: process.stdout.fd,
      },
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    redact: {
      paths: ["email", "password", "address"],
      remove: true,
    },
    /*
    ------FORMATTERS DON'T WORK WITH MULTIPLE TRANSPORT------
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    */
    // customLevels: { catastrophe: 70 },          // making custom pino level
  },
  transport,
);

module.exports = logger;
