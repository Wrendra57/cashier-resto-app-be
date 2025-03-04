const winston = require("winston");
const path = require("path");
const {format} = require("winston")

const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";

//Format log dalam JSON agar mudah dibaca
const logFormat = format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.json()
)
const logFormatConsole = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Format waktu
    format.printf(({ level, message, timestamp, ...meta }) => {
        return `[${level.toUpperCase()}] ${timestamp} - ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
)
const logger = (filename) => {
    const baseFilename = path.basename(filename);
    return winston.createLogger({
        level: isProduction ? "warn" : "debug",
        format: logFormat,
        defaultMeta: {file: baseFilename},
        transports: [
            new winston.transports.Console({ format: logFormatConsole }),
            new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
            new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
        ],
    });
}


module.exports = logger;