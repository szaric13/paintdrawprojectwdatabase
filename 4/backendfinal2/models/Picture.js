const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture_data: { type: [[String]], required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Picture', PictureSchema);