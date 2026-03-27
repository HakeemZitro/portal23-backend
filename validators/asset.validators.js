const { Joi } = require("celebrate");
const { session_token, id } = require("./common.js");


// ----- Validaciones para headers ----- //
const authCookie = Joi.object({
  session_token,
}).unknown(true);

// ----- Validaciones para parámetros ----- //
const idParams = Joi.object({
  id,
});


module.exports = { authCookie, idParams };