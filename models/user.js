const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 40
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "El email es inválido"
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dmnjcke27/image/upload/v1774291526/defaultAvatar_otrhfn.webp",
    validate: {
      validator: (value) => validator.isURL(value),
      message: "La URL del avatar es inválida"
    }
  },
  role: {
    type: String,
    enum: ["student", "AdminOnly"],
    default: "student",
    select: false
  }
}, { timestamps: true });

// ----- Metodo adicional para encontrar usuario por credenciales ----- //
userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if(!user) {
        return Promise.reject(new Error("Email o contraseña incorrecto"));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if(!matched) {
            return Promise.reject(new Error("Email o contraseña incorrecto"));
          }
        return user;
        });
    });
};


module.exports = mongoose.model("User", userSchema);