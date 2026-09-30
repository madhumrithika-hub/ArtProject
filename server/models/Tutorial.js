const mongoose = require('mongoose');
const supplySchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        note: String,
    },
    { _id: false }
);
const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  instructions: [{ type: String }],
  artistTip: { type: String },
  commonMistakes: { type: String },
  recommendedTool: { type: String },
  estimatedTime: { type: String },
  layerVisualUrl: { type: String },
});

const tutorialSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  originalMedium: {
    type: String,
    default: 'Oil Painting',
  },
  targetMedium: {
    type: String,
    required: true,
    default: 'Watercolor',
  },
  subjectType: {
    type: String,
    default: 'Portrait',
  },
  originalImageUrl: {
    type: String,
    required: true,
  },
  wireframeUrl: {
    type: String,
  },
  valueStudyUrl: {
    type: String,
  },
  colorPalette: [
    {
      hex: String,
      name: String,
      role: String,
    },
  ],
  suppliesNeeded: [supplySchema],
  stages: [stepSchema],
  savedDrawing: {
    canvasData: String,
    previewUrl: String,
    updatedAt: { type: Date, default: Date.now },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tutorial', tutorialSchema);
