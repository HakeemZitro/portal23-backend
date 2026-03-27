const assetsRouter = require("express").Router();
const { celebrate, Segments } = require("celebrate");

const { auth, adminAuth } = require("../middlewares/auth.js");
const { authCookie, idParams } = require("../validators/asset.validators.js");
const { createUploadAssetURL, getAllAssets, getAssetById } = require("../controllers/assets.controller.js");


// ----- Rutas para assets ----- //
assetsRouter.get("/assets", auth, celebrate({
  [Segments.COOKIES]: authCookie,
}), getAllAssets);

assetsRouter.get("/assets/:id", auth, celebrate({
  [Segments.COOKIES]: authCookie,
  [Segments.PARAMS]: idParams,
}), getAssetById);

assetsRouter.post("/assets/upload-url", auth, adminAuth, celebrate({
  [Segments.COOKIES]: authCookie,
}), createUploadAssetURL);


module.exports = assetsRouter;