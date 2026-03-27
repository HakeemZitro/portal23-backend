const { Joi } = require("celebrate");
const { name, id, session_token, avatar } = require("./common.js");


// ----- Validaciones para headers ----- //
const authCookie = Joi.object({
  session_token,
}).unknown(true);

// ----- Validaciones para params ----- //
const idParams = Joi.object({
  id,
});

// ----- Validaciones para body ----- //
const userInfoBody = Joi.object({
  name,
});

const userAvatarBody = Joi.object({
  avatar,
});


module.exports = { authCookie, idParams, userInfoBody, userAvatarBody };
