const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { JWT_SECRET } = process.env;

const UnauthorizedError = require("../errors/unauthorized.error.js");
const ForbiddenError = require("../errors/forbidden.error.js");


// ----- Confirma autorizacion mediante cookie ----- //
module.exports.auth = (req, res, next) => {
  const token = req.cookies.session_token;

  if (!token) {
    return next(new UnauthorizedError("Sin autorización, inicia sesión"));
  }

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
