require('dotenv').config();

const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const cors = require("cors")
const app = express();
const requestlogger = require("./middleware/requestLogger")
/** Install request logger */
app.use(morgan("dev"));

/** Install JSON request parser */
app.use(express.json());
app.use(cors(false))
app.use(express.urlencoded({ extended: true }))
app.use(requestlogger)
/** Install Router */

app.use(router);


module.exports = app;
