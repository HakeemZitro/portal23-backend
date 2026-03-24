const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, BCRYPT_ROUNDS } = process.env;

const BadRequestError = require("../errors/bad-request.error.js");
const UnauthorizedError = require("../errors/unauthorized.error.js");
const NotFoundError = require("../errors/not-found.error.js");
const ConflictError = require("../errors/conflict.error.js");


// ----- Controladores para usuarios ----- //

// ----- Crear nuevo usuario ----- //
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, Number(BCRYPT_ROUNDS))
    .then((hash) => User.create({ name, email, password: hash, role: "student" }))
    .then((newUser) => res.status(201).send({ name: newUser.name, email: newUser.email }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("El email que intentas usar ya está registrado"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Datos insuficientes y/o inválidos para crear un usuario"));
      }
      next(err);
    });
};

// ----- Inicio de Sesion ----- //
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN }) });
    })
    .catch(() => {
      next(new UnauthorizedError("Email o contraseña incorrecto"));
    });
}

// ----- Obtener informacion de usuario actual ----- //
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new UnauthorizedError("Sin autorización, inicia sesión") })
    .then(user => res.send(user))
    .catch(next);
}

// ----- Actualizar información de usuario ----- //
module.exports.updateUserInfo = (req, res, next) => {
  const { name } = req.body;

  User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true })
    .orFail(() => { throw new UnauthorizedError("Sin autorización, inicia sesión") })
    .then(updatedUser => res.send(updatedUser))
    .catch(err => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Datos insuficientes o inválidos para actualizar un usuario"));
      }
      next(err);
    });
};

// ----- Actualizar avatar de usuario ----- //
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new UnauthorizedError("Sin autorización, inicia sesión") })
    .then(updatedUser => res.send(updatedUser))
    .catch(err => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Datos insuficientes o inválidos para actualizar el avatar"));
      }
      next(err);
    });
};


// ----- Controladores para admin ----- //

// ----- Obtener todos los usuarios ----- //
module.exports.getUsers = (req, res, next) => {
  User.find({})
  .orFail(() => { throw new NotFoundError("No se encontraron usuarios") })
  .then((users) => res.send(users))
  .catch(next);
};

// ----- Obtener un usuario por ID ----- //
module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => { throw new NotFoundError("No se encontro al usuario") })
    .then(user => res.send(user))
    .catch(next);
};
