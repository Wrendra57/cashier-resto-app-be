/**
 * @file contains entry point of controllers api v1 module
 * @author Fikri Rahmat Nurhidayat
 */

const authController = require("./authController");
const userController = require("./userController");
module.exports = {
  userController, authController
};
