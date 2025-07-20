function getColorName(hexCode) {
  const colorNames = {
    '#B297A8': 'Dusty Rose',
    '#93A1B0': 'Soft Blue',
    '#6E7F8C': 'Muted Gray',
    '#A5C2C3': 'Soft Teal',
    '#A28D9E': 'Muted Mauve',
    '#C19A6B': 'Camel',
    '#6B8E23': 'Olive Green',
    '#7B3F00': 'Chocolate Brown',
    '#8B7355': 'Warm Gray',
    '#FFFFF0': 'Ivory',
    '#FFD700': 'Mustard Yellow',
    '#CC5500': 'Burnt Orange',
    '#B7410E': 'Rust',
    '#006400': 'Deep Emerald',
    '#4169E1': 'Royal Blue',
    '#800080': 'Rich Purple',
    '#FF0000': 'True Red',
    '#FF69B4': 'Hot Pink',
    '#FFFFFF': 'Pure White',
    '#36454F': 'Charcoal Gray',
    '#000080': 'Navy Blue',
    '#000000': 'Black',
    '#C0C0C0': 'Silver'
  };
  
  return colorNames[hexCode.toUpperCase()] || `Color ${hexCode}`;
}

function createPaletteFromHex(hexColors) {
  if (!hexColors || hexColors.length === 0) {
    return '';
  }
  
  let html = '<div class="color-palette">';
  html += '<h5>Recommended Color Palette:</h5>';
  html += '<div class="color-swatches">';
  
  for (let i = 0; i < Math.min(hexColors.length, 8); i++) {
    const hexCode = hexColors[i];
    const colorName = getColorName(hexCode);
    
    html += `
      <div class="color-swatch" title="${colorName}">
        <div class="color-preview" style="background-color: ${hexCode}"></div>
        <div class="color-name">${colorName}</div>
      </div>
    `;
  }
  
  html += '</div></div>';
  return html;
}

function extractColorsFromText(text) {
  const colors = [];
  const textLower = text.toLowerCase();
  
  // Color mapping for text extraction
  const colorMapping = {
    'camel': '#C19A6B',
    'olive green': '#6B8E23',
    'chocolate brown': '#7B3F00',
    'warm gray': '#8B7355',
    'ivory': '#FFFFF0',
    'mustard yellow': '#FFD700',
    'burnt orange': '#CC5500',
    'rust': '#B7410E',
    'forest green': '#228B22',
    'teal': '#008080',
    'tomato red': '#FF6347',
    'deep emerald green': '#006400',
    'royal blue': '#4169E1',
    'rich purple': '#800080',
    'true red': '#FF0000',
    'hot pink': '#FF69B4',
    'pure white': '#FFFFFF',
    'charcoal gray': '#36454F',
    'navy blue': '#000080',
    'black': '#000000',
    'silver': '#C0C0C0',
    'icy blue': '#87CEEB',
    'coral': '#FF7F50',
    'bright yellow': '#FFFF00',
    'kelly green': '#4CBB17',
    'bright blue': '#0000FF',
    'cream': '#FFFDD0',
    'gold': '#FFD700',
    'peach': '#FFCBA4',
    'lavender': '#E6E6FA',
    'sage green': '#9DC183',
    'dusty rose': '#DC143C',
    'mauve': '#E0B0FF',
    'soft teal': '#20B2AA'
  };
  
  // Look for color mentions in the text
  for (const [colorName, hexCode] of Object.entries(colorMapping)) {
    if (textLower.includes(colorName)) {
      colors.push({
        name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
        hex: hexCode
      });
    }
  }
  
  return colors.slice(0, 8); // Limit to 8 colors
}

function createPaletteFromText(text) {
  const colors = extractColorsFromText(text);
  
  if (colors.length === 0) {
    return '<p>No specific colors found in the analysis.</p>';
  }
  
  let html = '<div class="color-palette">';
  html += '<h5>Recommended Color Palette:</h5>';
  html += '<div class="color-swatches">';
  
  for (const color of colors) {
    html += `
      <div class="color-swatch" title="${color.name}">
        <div class="color-preview" style="background-color: ${color.hex}"></div>
        <div class="color-name">${color.name}</div>
      </div>
    `;
  }
  
  html += '</div></div>';
  return html;
}

module.exports = {
  createPaletteFromHex,
  extractColorsFromText,
  createPaletteFromText
}; 