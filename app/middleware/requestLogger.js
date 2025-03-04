const createLogger = require('../utils/logger')
const logger = createLogger(__filename)
module.exports = (req, res, next) => {
    req.requestId = req.headers['x-request-id'] || `req-${Date.now()}`;
    logger.http({
        message: 'Incoming request',
        method: req.method,
        url: req.originalUrl,
        requestId:req.requestId,
        ip: req.ip,
    });
    next();
}