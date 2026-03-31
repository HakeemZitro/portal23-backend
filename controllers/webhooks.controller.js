const Asset = require("../models/asset.js");
const Mux = require("@mux/mux-node");
const { MUX_WEBHOOK_SECRET } = process.env;

const mux = new Mux();


// ----- Controladores para webhooks ----- //

// ----- Webhook para manejar eventos de Mux ----- //
module.exports.handleMuxWebhook = (req, res) => {
  let event;

  // Validar firma de Mux
  try {
    const rawBody = req.body.toString();
    event = mux.webhooks.unwrap(rawBody, req.headers, MUX_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Firma de Mux inválida:", err.message);
    return res.sendStatus(400);
  }

  console.log("Evento MUX válido:", event.type);

  // Evento cuando se crea un asset en Mux
  if (event.type === "video.upload.asset_created") {
    Asset.findOne({ upload_id: event.data.id })
    .then(asset => {
      if (!asset) { throw new Error("Asset no encontrado para upload_id: " + event.data.id); }
      return Asset.findOneAndUpdate({ upload_id: event.data.id }, { 
          asset_id: event.data.asset_id, 
          status: "processing", 
          $unset: { expiresAt: 1 }
        });
    })
    .then(() => { res.sendStatus(200); })
    .catch(err => { 
      console.error("Error en video.upload.asset_created:", err); 
      res.status(500).send(err.message); 
    });
  }
  
  // Evento cuando el asset esta listo para reproducirse
  else if (event.type === "video.asset.ready") {
    Asset.findOne({ asset_id: event.data.id })
      .then(asset => {
        if (!asset) { throw new Error("Asset no encontrado para asset_id: " + event.data.id); }
        return Asset.findOneAndUpdate({ asset_id: event.data.id }, {
          title: event.data.meta?.title || "Sin título",
          playback_id: event.data.playback_ids?.[0]?.id, 
          type: event.data.resolution_tier === "audio-only" ? "Audio" : "Video",
          duration: Math.floor(event.data.duration), 
          status: event.data.status, 
        });
      })
      .then(() => { res.sendStatus(200); })
      .catch(err => { 
        console.error("Error en video.asset.ready:", err); 
        res.status(500).send(err.message); 
      });
  }

  else { console.log("Evento no manejado:", event.type); res.sendStatus(200); }
};