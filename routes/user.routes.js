const usersRouter = require("express").Router();
const { celebrate, Segments } = require("celebrate");

const { auth, adminAuth } = require("../middlewares/auth.js");
const { authHeaders, idParams, userInfoBody, userAvatarBody } = require("../validators/user.validators.js");
const { getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar } = require("../controllers/users.controller.js");


// ----- Rutas para usuarios ----- //
usersRouter.get("/users", auth, adminAuth, celebrate({
  [Segments.HEADERS]: authHeaders,
}), getUsers);

usersRouter.get("/users/me", auth, celebrate({
  [Segments.HEADERS]: authHeaders,
}), getUserInfo);

usersRouter.patch("/users/me", auth, celebrate({
  [Segments.HEADERS]: authHeaders,
  [Segments.BODY]: userInfoBody,
}), updateUserInfo);

usersRouter.patch("/users/me/avatar", auth, celebrate({
  [Segments.HEADERS]: authHeaders,
  [Segments.BODY]: userAvatarBody,
}), updateUserAvatar);

usersRouter.get("/users/:id", auth, adminAuth, celebrate({
  [Segments.HEADERS]: authHeaders,
  [Segments.PARAMS]: idParams,
}), getUserById);


module.exports = usersRouter;