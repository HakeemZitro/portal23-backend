const { Joi } = require("celebrate");
const validator = require("validator");


// ----- Validacion de URL ----- //
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
}

// ----- Validaciones comunes ----- //
const name = Joi.string().min(2).max(40).required();
const id = Joi.string().hex().length(24).required();
const email = Joi.string().email().required();
const password = Joi.string().min(6).required();
const authorization = Joi.string().required();
const avatar = Joi.string().custom(validateURL);

module.exports = { name, id, email, password, authorization, avatar };