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

// ----- Validaciones para body ----- //
const uploadAssetBody = Joi.object({
  title: Joi.string().required().min(2).max(100),
});

module.exports = { authCookie, idParams, uploadAssetBody };