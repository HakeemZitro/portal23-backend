const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { JWT_SECRET } = process.env;

const UnauthorizedError = require("../errors/unauthorized-err.js");
const ForbiddenError = require("../errors/forbidden-err.js");


// ----- Confirma autorizacion mediante token ----- //
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError("Sin autorización, inicia sesión"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }
  catch (e) {
    next(new UnauthorizedError("Token inválido, inicia sesión"));
  }
};

module.exports.adminAuth = (req, res, next) => {
  User.findById(req.user._id).select("+role")
    .then((user) => {
      if (!user || user.role !== "AdminOnly") {
        return next(new ForbiddenError("Sin autorización"));
      }
      next();
    })
    .catch(next);
};
