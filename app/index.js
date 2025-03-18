require('dotenv').config();

const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const cors = require("cors")
const app = express();
const requestlogger = require("./middleware/requestLogger")
app.use(morgan("dev"));

app.use(express.json());
app.use(cors(false))
app.use(express.urlencoded({ extended: true }))
app.use(requestlogger)

app.use(router);


module.exports = app;
