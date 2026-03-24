const Asset = require("../models/asset");
const { MUX_TokenID, MUX_SecretKEY } = process.env;


// ----- Controladores para assets ----- //

// ----- Crear URL de subida para nuevo asset en MUX y lo registra en base de datos ----- //
module.exports.createUploadAssetURL = (req, res) => {
  fetch("https://api.mux.com/video/v1/uploads", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(MUX_TokenID+":"+MUX_SecretKEY).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cors_origin: "*",
      new_asset_settings: {
        playback_policies: ["public"],
        max_resolution_tier: "1080p",
        video_quality: "basic"
      }
    })
  })
  .then(res => res.json())
  .then(data => { return Asset.create({ upload_id: data.data.id, status: data.data.status })
    .then(asset => { res.send({ upload_url: data.data.url, upload_id: data.data.id }); }); 
  })
  .catch(err => { res.status(500).json({ error: err.message }); });
};


// ----- Obtener todos los assets de MUX ----- //
module.exports.getAllAssets = (req, res) => {
  fetch("https://api.mux.com/video/v1/assets", {
    method: "GET",
    headers: {
      "Authorization": `Basic ${Buffer.from(MUX_TokenID+":"+MUX_SecretKEY).toString("base64")}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => res.send(data.data))
  .catch(err => res.status(500).json({ error: err.message }));
};


// ----- Obtener assets de un modulo ----- //
module.exports.getAssetsByModule = (req, res) => {
  const { moduleId } = req.params;

  Asset.find({ moduleId })
    .sort("order")
    .then(assets => res.send(assets))
    .catch(err => res.status(500).json({ error: err.message }));
};


// ----- Obtener un asset por ID ----- //
module.exports.getAssetById = (req, res) => {
  const { id } = req.params;

  Asset.findById(id)
    .then(asset => res.send(asset))
    .catch(err => res.status(500).json({ error: err.message }));
};