const express = require("express");
const controllers = require("../app/controllers");
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerOptions = require('../app/swagger/swaggerOptions')
const {validation} = require("../app/middleware/validations");
const {createUserValidation, loginUserValidation, findByUserIdValidation,verifyUserValidation, changeRolesValidation} = require("../app/middleware/validations/userValidation");
const {loginUser} = require("../app/services/authService");
const {parseToken, checkRole} = require("../app/middleware/authorization");
const {createTenantValidation} = require("../app/middleware/validations/tenantValidation");
const swaggerSpec = swaggerJsdoc(swaggerOptions)
const apiRouter = express.Router();

apiRouter.get("/", (req, res)=>{
  res.status(200).json({Code: 200, message: "Welcome to the API Goto the Documentation API http://localhost:8080/api-docs", data: null});
});
apiRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// auth management
apiRouter.post("/api/v1/auth/register", validation(createUserValidation), controllers.api.v1.authController.registerUser);
apiRouter.post("/api/v1/auth/login", validation(loginUserValidation), controllers.api.v1.authController.login);
apiRouter.get("/api/v1/auth/me", parseToken, controllers.api.v1.authController.authMe);

// user management
apiRouter.get("/api/v1/users/:id",
    parseToken,
    checkRole(["superadmin"]),
    validation(findByUserIdValidation),
    controllers.api.v1.userController.findByUserId);
apiRouter.patch("/api/v1/users/verify/:id",
    parseToken,
    checkRole(["superadmin"]),
    validation(verifyUserValidation),
    controllers.api.v1.userController.verifyUser);
apiRouter.patch("/api/v1/users/roles/update/:id",
    parseToken,
    checkRole(["superadmin"]),
    validation(changeRolesValidation),
    controllers.api.v1.userController.changeRoles);

// tenants management
apiRouter.post("/api/v1/tenants",
    parseToken,
    checkRole(["superadmin"]),
    validation(createTenantValidation),
    controllers.api.v1.tenantController.createTenant);

apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
