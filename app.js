const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env.development" });
const { PORT, DB_URL } = process.env;


const usersRouter = require("./routes/user.routes.js");
const assetsRouter = require("./routes/asset.routes.js");
const { handleMuxWebhook } = require("./controllers/webhooks.controller.js");
const { login, createUser, logout } = require("./controllers/users.controller.js");
const { celebrate, Segments, errors } = require("celebrate");
const { createUserBody, loginBody, logoutCookies } = require("./validators/auth.validators.js");
const NotFoundError = require("./errors/not-found.error.js");
const { auth } = require("./middlewares/auth.js");
const { requestLogger, errorLogger } = require("./middlewares/logger.js");

//Configuración de CORS
const cors = require("cors");
const allowedOrigins = ["http://localhost:3210", "https://hakeemzitro.github.io/portal23-frontend"];
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
}


// ----- Inicialización del servidor ----- //
const app = express();
// ----- Conexion a MongoDB ----- //
mongoose.connect(DB_URL);

// ----- Endpoint para manejar webhooks de Mux ----- //
app.post("/webhooks/mux", express.raw({ type: "application/json" }), handleMuxWebhook);

// ----- Configuración de CORS ----- //
app.use(cors(corsOptions));

// ----- Middlewares para el análisis del cuerpo ----- //
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----- Middleware para registro de peticiones ----- //
app.use(requestLogger);

// ----- Rutas de Inicio de Sesión y Registro con validación de datos ----- //
app.post("/register", celebrate({
  [Segments.BODY]: createUserBody,
}), createUser);
app.post("/login", celebrate({
  [Segments.BODY]: loginBody,
}), login);
app.post("/logout", auth, celebrate({
  [Segments.COOKIES]: logoutCookies,
}), logout);

// ----- Rutas protegidas por autenticación (usuarios y assets) ----- //
app.use("/", usersRouter);
app.use("/", assetsRouter);

// ----- Middleware para manejar rutas no encontradas ----- //
app.use((req, res, next) => {
  const err = new NotFoundError("Recurso solicitado no encontrado");
  next(err);
});

// ----- Middleware para registro de errores ----- //
app.use(errorLogger);

// ----- Middlewares para manejar errores ----- //
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Se ha producido un error en el servidor' : message });
});

// ----- Arranque del servidor ----- //
app.listen(PORT);