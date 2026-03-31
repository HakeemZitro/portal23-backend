const usersRouter = require("express").Router();
const { celebrate, Segments } = require("celebrate");

const { auth, adminAuth } = require("../middlewares/auth.js");
const { authCookie, idParams, userInfoBody, userAvatarBody } = require("../validators/user.validators.js");
const { getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar, confirmAdmin } = require("../controllers/users.controller.js");


// ----- Rutas para usuarios ----- //
usersRouter.get("/users/me", auth, celebrate({
  [Segments.COOKIES]: authCookie,
}), getUserInfo);

usersRouter.patch("/users/me", auth, celebrate({
  [Segments.COOKIES]: authCookie,
  [Segments.BODY]: userInfoBody,
}), updateUserInfo);

usersRouter.patch("/users/me/avatar", auth, celebrate({
  [Segments.COOKIES]: authCookie,
  [Segments.BODY]: userAvatarBody,
}), updateUserAvatar);

usersRouter.get("/users", auth, adminAuth, celebrate({
  [Segments.COOKIES]: authCookie,
}), getUsers);

usersRouter.get("/users/:id", auth, adminAuth, celebrate({
  [Segments.COOKIES]: authCookie,
  [Segments.PARAMS]: idParams,
}), getUserById);



module.exports = usersRouter;