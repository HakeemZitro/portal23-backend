const { Joi } = require("celebrate");
const { name, id, authorization, avatar } = require("./common.js");


// ----- Validaciones para headers ----- //
const authHeaders = Joi.object({
  authorization,
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


module.exports = { authHeaders, idParams, userInfoBody, userAvatarBody };
