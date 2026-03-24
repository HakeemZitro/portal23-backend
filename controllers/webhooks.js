const Asset = require("../models/asset.js");
const Mux = require("@mux/mux-node");
const { MUX_WEBHOOK_SECRET } = process.env;

const mux = new Mux();

//Webhook para manejar eventos de Mux
exports.handleMuxWebhook = (req, res) => {
  let event;

  //Validar firma de Mux
  try {
    const rawBody = req.body;
    const signature = req.headers["mux-signature"];

    event = mux.webhooks.verifySignature(rawBody, signature, MUX_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Firma de Mux inválida:", err.message);
    return res.sendStatus(400);
  }

  console.log("Evento MUX válido:", event.type);

  //Evento cuando se crea un asset en Mux
  if (event.type === "video.upload.asset_created") {
    Asset.findOne({ upload_id: event.data.id })
    .then(asset => {
      if (!asset) { throw new Error("Asset no encontrado"); }
      return Asset.findOneAndUpdate({ upload_id: event.data.id }, { 
          asset_id: event.data.asset_id, 
          status: "processing", 
        });
    })
    .then(() => { res.sendStatus(200); })
    .catch(err => { console.error(err); res.sendStatus(500); });
  }
  
  //Evento cuando el asset esta listo para reproducirse
  else if (event.type === "video.asset.ready") {
    Asset.findOne({ asset_id: event.data.id })
      .then(asset => {
        if (!asset) { throw new Error("Asset no encontrado"); }
        return Asset.findOneAndUpdate({ asset_id: event.data.id }, {
          title: event.data.meta.title,
          playback_id: event.data.playback_ids?.[0]?.id, 
          type: event.data.resolution_tier === "audio-only" ? "Audio" : "Video",
          duration: Math.floor(event.data.duration), 
          status: event.data.status, 
        });
      })
      .then(() => { res.sendStatus(200); })
      .catch(err => { console.error(err); res.sendStatus(500); });
  }

  else { console.log("Evento no manejado:", event.type); res.sendStatus(200); }
};