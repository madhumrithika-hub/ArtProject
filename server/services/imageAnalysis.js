const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

/**
 * Maps an RGB color to the closest traditional artist pigment name
 */
function getPigmentName(r, g, b) {
  const pigments = [
    { name: 'Titanium White', r: 245, g: 245, b: 245, role: 'Pure Highlights' },
    { name: 'Ivory / Warm White', r: 240, g: 235, b: 220, role: 'Base Highlights' },
    { name: 'Yellow Ochre', r: 204, g: 153, b: 68, role: 'Warm Midtone' },
    { name: 'Cadmium Lemon Yellow', r: 245, g: 225, b: 40, role: 'Bright Accent' },
    { name: 'Raw Sienna', r: 180, g: 110, b: 50, role: 'Earth Tone' },
    { name: 'Burnt Sienna', r: 150, g: 60, b: 35, role: 'Warm Shadow' },
    { name: 'Venetian Red', r: 180, g: 65, b: 55, role: 'Flesh / Accent' },
    { name: 'Cadmium Red', r: 220, g: 40, b: 35, role: 'Vibrant Accent' },
    { name: 'Alizarin Crimson', r: 160, g: 30, b: 50, role: 'Deep Red Glaze' },
    { name: 'Raw Umber', r: 90, g: 70, b: 50, role: 'Cool Shadow' },
    { name: 'Burnt Umber', r: 75, g: 45, b: 30, role: 'Deep Shadow' },
    { name: 'Ultramarine Blue', r: 40, g: 60, b: 160, role: 'Atmosphere / Cool' },
    { name: 'Cobalt Blue', r: 35, g: 90, b: 185, role: 'Midtone Sky' },
    { name: 'Cerulean Blue', r: 45, g: 150, b: 200, role: 'Cool Highlight' },
    { name: 'Prussian Blue', r: 15, g: 45, b: 85, role: 'Deep Core Shadow' },
    { name: 'Viridian Green', r: 40, g: 120, b: 90, role: 'Cool Earth Green' },
    { name: 'Sap Green', r: 75, g: 120, b: 45, role: 'Warm Green' },
    { name: 'Payne\'s Grey', r: 60, g: 75, b: 90, role: 'Neutral Dark' },
    { name: 'Lamp Black', r: 25, g: 25, b: 25, role: 'Deepest Occlusion' },
    { name: 'Peach / Portrait Tint', r: 235, g: 190, b: 165, role: 'Flesh Base' },
    { name: 'Soft Rose Tint', r: 225, g: 160, b: 160, role: 'Cheek / Warm Wash' },
  ];

  let closest = pigments[0];
  let minDistance = Infinity;

  for (const p of pigments) {
    const dist = Math.sqrt(
      Math.pow(r - p.r, 2) + Math.pow(g - p.g, 2) + Math.pow(b - p.b, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closest = p;
    }
  }

  return { name: closest.name, role: closest.role };
}

/**
 * Converts RGB numbers to hex string
 */
function rgbToHex(r, g, b) {
  const toHex = (c) => ('0' + Math.max(0, Math.min(255, Math.round(c))).toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Analyze uploaded image, extract dominant artist color palette,
 * generate structural wireframe (edge detection) & value study (posterized shadow/mid/highlight)
 */
async function processArtImage(filePath, originalFilename) {
  try {
    const baseName = path.basename(filePath, path.extname(filePath));
    const outputDir = path.dirname(filePath);

    // Read source image
    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // 1. Generate Dominant Palette Swatches by grid sampling
    const colorSamples = [];
    const stepX = Math.max(1, Math.floor(width / 16));
    const stepY = Math.max(1, Math.floor(height / 16));

    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const idx = (y * width + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        const a = image.bitmap.data[idx + 3];
        if (a > 128) {
          colorSamples.push({ r, g, b });
        }
      }
    }

    // Cluster into ~6 distinct artist color swatches
    const palette = [];
    const usedHexes = new Set();

    // Sort by brightness (luminance)
    colorSamples.sort((c1, c2) => {
      const lum1 = 0.299 * c1.r + 0.587 * c1.g + 0.114 * c1.b;
      const lum2 = 0.299 * c2.r + 0.587 * c2.g + 0.114 * c2.b;
      return lum1 - lum2;
    });

    const sampleIndices = [
      0, // Darkest shadow
      Math.floor(colorSamples.length * 0.2), // Core shadow
      Math.floor(colorSamples.length * 0.4), // Midtone
      Math.floor(colorSamples.length * 0.6), // Upper midtone
      Math.floor(colorSamples.length * 0.8), // Highlight base
      colorSamples.length - 1, // Specular highlight
    ];

    sampleIndices.forEach((sIdx, i) => {
      const s = colorSamples[Math.min(sIdx, colorSamples.length - 1)];
      if (s) {
        const hex = rgbToHex(s.r, s.g, s.b);
        if (!usedHexes.has(hex)) {
          usedHexes.add(hex);
          const pigmentInfo = getPigmentName(s.r, s.g, s.b);
          palette.push({
            hex,
            name: pigmentInfo.name,
            role: pigmentInfo.role,
          });
        }
      }
    });

    // 2. Generate Structural Wireframe / Line Art (Edge detection)
    const wireframe = image.clone();
    wireframe.greyscale();
    
    // Sobel edge filter kernel for outline extraction
    wireframe.convolute([
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1],
    ]);

    // Invert so edges are dark lines on light background (like sketch paper)
    for (let i = 0; i < wireframe.bitmap.data.length; i += 4) {
      const edgeVal = wireframe.bitmap.data[i];
      // Thresholding for clean lineart
      const sketchVal = edgeVal > 40 ? 20 : 250;
      wireframe.bitmap.data[i] = sketchVal;
      wireframe.bitmap.data[i + 1] = sketchVal;
      wireframe.bitmap.data[i + 2] = sketchVal;
      wireframe.bitmap.data[i + 3] = 255;
    }

    const wireframeFilename = `${baseName}-wireframe.png`;
    const wireframePath = path.join(outputDir, wireframeFilename);
    await wireframe.write(wireframePath);

    // 3. Generate Tonal Value Study Layer (3-tone posterized: Shadow, Midtone, Light)
    const valueStudy = image.clone();
    valueStudy.greyscale();

    for (let i = 0; i < valueStudy.bitmap.data.length; i += 4) {
      const gray = valueStudy.bitmap.data[i];
      let tone;
      if (gray < 85) {
        tone = 45; // Dark shadow block
      } else if (gray < 170) {
        tone = 140; // Midtone body
      } else {
        tone = 240; // High light plane
      }
      valueStudy.bitmap.data[i] = tone;
      valueStudy.bitmap.data[i + 1] = tone;
      valueStudy.bitmap.data[i + 2] = tone;
      valueStudy.bitmap.data[i + 3] = 255;
    }

    const valueFilename = `${baseName}-valuestudy.png`;
    const valuePath = path.join(outputDir, valueFilename);
    await valueStudy.write(valuePath);

    return {
      width,
      height,
      wireframeUrl: `/uploads/${wireframeFilename}`,
      valueStudyUrl: `/uploads/${valueFilename}`,
      colorPalette: palette.length > 0 ? palette : [
        { hex: '#2c221e', name: 'Raw Umber', role: 'Shadow Core' },
        { hex: '#875638', name: 'Burnt Sienna', role: 'Warm Midtone' },
        { hex: '#d4a373', name: 'Yellow Ochre', role: 'Skin / Plane Light' },
        { hex: '#faedcd', name: 'Titanium White Tint', role: 'Highlights' },
      ],
    };
  } catch (error) {
    console.error('[ImageAnalysis] Error processing image:', error);
    return {
      wireframeUrl: null,
      valueStudyUrl: null,
      colorPalette: [
        { hex: '#1a1a1a', name: 'Lamp Black', role: 'Deep Occlusion' },
        { hex: '#634735', name: 'Burnt Umber', role: 'Core Shadow' },
        { hex: '#b38260', name: 'Raw Sienna', role: 'Midtone' },
        { hex: '#edd3be', name: 'Ivory Tint', role: 'Highlight' },
      ],
    };
  }
}

module.exports = {
  processArtImage,
  getPigmentName,
  rgbToHex,
};
