const assetsRouter = require("express").Router();
const { celebrate, Segments } = require("celebrate");

const { auth, adminAuth } = require("../middlewares/auth.js");
const { authHeaders, idParams } = require("../validators/asset.validators.js");
const { createUploadAssetURL, getAllAssets, getAssetById } = require("../controllers/assets.controller.js");


// ----- Rutas para assets ----- //
assetsRouter.get("/assets", auth, celebrate({
  [Segments.HEADERS]: authHeaders,
}), getAllAssets);

assetsRouter.get("/assets/:id", auth, celebrate({
  [Segments.HEADERS]: authHeaders,
  [Segments.PARAMS]: idParams,
}), getAssetById);

assetsRouter.post("/assets/upload-url", auth, adminAuth, celebrate({
  [Segments.HEADERS]: authHeaders,
}), createUploadAssetURL);


module.exports = assetsRouter;