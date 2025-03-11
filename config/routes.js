const express = require("express");
const controllers = require("../app/controllers");
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerOptions = require('../app/swagger/swaggerOptions')
const {validation} = require("../app/middleware/validations");
const {createUserValidation, loginUserValidation, findByUserIdValidation,verifyUserValidation} = require("../app/middleware/validations/userValidation");
const {loginUser} = require("../app/services/authService");
const {parseToken, checkRole} = require("../app/middleware/authorization");
const swaggerSpec = swaggerJsdoc(swaggerOptions)
const apiRouter = express.Router();


// apiRouter.get("/api/v1/posts", controllers.api.v1.postController.list);
// apiRouter.post("/api/v1/posts", controllers.api.v1.postController.create);
// apiRouter.put("/api/v1/posts/:id", controllers.api.v1.postController.update);
// apiRouter.get("/api/v1/posts/:id", controllers.api.v1.postController.show);
// apiRouter.delete(
//   "/api/v1/posts/:id",
//   controllers.api.v1.postController.destroy
// );

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
    validation(findByUserIdValidation),
    parseToken,
    checkRole(["superadmin"]),
    controllers.api.v1.userController.findByUserId);
apiRouter.patch("/api/v1/users/verify/:id",
    validation(verifyUserValidation),
    parseToken,
    checkRole(["superadmin"]),
    controllers.api.v1.userController.verifyUser);




apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
