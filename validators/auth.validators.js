const { Joi } = require("celebrate");
const { name, email, password, session_token } = require("./common.js");


// ----- Validaciones para cerrar sesión ----- //
const logoutCookies = Joi.object({
  session_token,
}).unknown(true);

// ----- Validaciones para crear usuario ----- //
const createUserBody = Joi.object({
  name,
  email,
  password,
});

// ----- Validaciones para inicio de sesion ----- //
const loginBody = Joi.object({
  email,
  password,
});


module.exports = { createUserBody, loginBody, logoutCookies };
