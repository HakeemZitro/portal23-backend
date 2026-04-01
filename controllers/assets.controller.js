const Asset = require("../models/asset");
const { MUX_TokenID, MUX_SecretKEY } = process.env;

const NotFoundError = require("../errors/not-found.error.js");

// ----- Controladores para assets ----- //

// ----- Crear URL de subida para nuevo asset en MUX y lo registra en base de datos ----- //
module.exports.createUploadAssetURL = (req, res, next) => {
  const { title } = req.body;

  fetch("https://api.mux.com/video/v1/uploads", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(MUX_TokenID+":"+MUX_SecretKEY).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cors_origin: "*",
      timeout: 3600,
      new_asset_settings: {
        playback_policies: ["public"],
        max_resolution_tier: "1080p",
        video_quality: "basic"
      }
    })
  })
  .then(res => res.json())
  .then(data => { 
    return Asset.create({ title, upload_id: data.data.id, status: data.data.status, expiresAt: new Date(Date.now() + 3600 * 1000) })
      .then(asset => { res.send({ upload_url: data.data.url, upload_id: data.data.id }); }); 
  })
  .catch(err => next(err));
};


// ----- Obtener todos los assets de MUX ----- //
module.exports.getAllAssets = (req, res, next) => {
  Asset.find({status: "ready"})
    .orFail(() => { throw new NotFoundError("No se encontraron assets")})
    .then(assets => res.send(assets))
    .catch(next);
};


// ----- Obtener assets de un modulo ----- //
module.exports.getAssetsByModule = (req, res, next) => {
  const { moduleId } = req.params;

  Asset.find({ moduleId })
    .orFail(() => { throw new NotFoundError("No se encontró el modulo")})
    .sort("order")
    .then(assets => res.send(assets))
    .catch(next);
};


// ----- Obtener un asset por ID ----- //
module.exports.getAssetById = (req, res, next) => {
  const { id } = req.params;

  Asset.findById(id)
    .orFail(() => { throw new NotFoundError("No se encontró el asset")})
    .then(asset => res.send(asset))
    .catch(next);
};