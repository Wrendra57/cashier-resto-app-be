const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();


apiRouter.get("/api/v1/posts", controllers.api.v1.postController.list);
apiRouter.post("/api/v1/posts", controllers.api.v1.postController.create);
apiRouter.put("/api/v1/posts/:id", controllers.api.v1.postController.update);
apiRouter.get("/api/v1/posts/:id", controllers.api.v1.postController.show);
apiRouter.delete(
  "/api/v1/posts/:id",
  controllers.api.v1.postController.destroy
);


apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
