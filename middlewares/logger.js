const winston = require("winston");
const expressWinston = require("express-winston");


// ----- Middleware para registro de peticiones ----- //
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// ----- Middleware para registro de errores ----- //
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});


module.exports = { requestLogger, errorLogger };