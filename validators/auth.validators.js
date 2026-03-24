const { Joi } = require("celebrate");
const { name, email, password } = require("./common.js");


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


module.exports = { createUserBody, loginBody };
