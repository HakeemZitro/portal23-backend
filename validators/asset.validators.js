const { Joi } = require("celebrate");
const { authorization, id } = require("./common.js");


// ----- Validaciones para headers ----- //
const authHeaders = Joi.object({
  authorization,
}).unknown(true);

// ----- Validaciones para parámetros ----- //
const idParams = Joi.object({
  id,
});


module.exports = { authHeaders, idParams };