const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  upload_id: {
    type: String,
    required: true
  },
  asset_id: {
    type: String,
  },
  playback_id: {
    type: String,
  },
  status: {
    type: String
  },
  title: {
    type: String,
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ["Video", "Audio"],
  },
  duration: {
    type: Number
  },
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },
  order: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    expires: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);