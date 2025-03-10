const createLogger = require('../utils/logger')
const {unauthorizedError,forbiddenError} = require("../utils/template/templateResponeApi");
const {verifyToken} = require("../utils/converter/jwtToken");
const logger = createLogger(__filename)

const parseToken = async (req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader ? authHeader.split(" ")[1] : null;

        if (!token) {
            logger.error({
                message: "Authorization token is missing",
            });
            return res.status(401).json(unauthorizedError("Authorization token is required"));
        }

        const decodedToken = await verifyToken(token);
        if (!decodedToken) {
            logger.error({
                message: "Invalid or expired token",
            });
            return res.status(401).json(unauthorizedError("Invalid or expired token"));
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error({
            message: "Error processing token",
            error: error.message,
        });
        return res.status(403).json(forbiddenError("Error processing token"));
    }
}


module.exports = {parseToken};