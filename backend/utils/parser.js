const { createPaletteFromHex } = require('./colorUtils');

function parseAnalysisResponse(responseText) {
  const sections = {
    observations: {
      skin_tone: '',
      undertone: '',
      contrast: '',
      overall_type: ''
    },
    reasoning: '',
    fashion_colors: {
      excellent_choices: '',
      hair_colors: '',
      makeup: {
        blush: '',
        lipstick: '',
        eyeshadow: ''
      }
    },
    fashion_colors_palette: '',
    disclaimer: '',
    full_response: responseText
  };

  try {
    // Clean the response text - remove markdown code blocks
    let cleanedText = responseText;
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Try to parse as JSON first
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonContent = cleanedText.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonContent);
      
      // Map JSON structure to our sections format
      sections.observations.overall_type = data.seasonal_type || '';
      
      const analysis = data.analysis || {};
      sections.observations.skin_tone = analysis.skin_tone || '';
      sections.observations.undertone = analysis.undertone || '';
      sections.observations.contrast = analysis.contrast || '';
      
      const recommendations = data.recommendations || {};
      const fashion_colors = recommendations.fashion_colors || {};
      
      // Fashion colors
      sections.fashion_colors.excellent_choices = fashion_colors.best_colors_description || '';
      
      // Hair colors
      sections.fashion_colors.hair_colors = recommendations.hair_color || '';
      
      // Makeup
      const makeup = recommendations.makeup || {};
      sections.fashion_colors.makeup.blush = makeup.blush || '';
      sections.fashion_colors.makeup.lipstick = makeup.lipstick || '';
      sections.fashion_colors.makeup.eyeshadow = makeup.eyeshadow || '';
      
      // Generate color palette from hex codes if available
      const color_palette_hex = fashion_colors.color_palette_hex || [];
      if (color_palette_hex.length > 0) {
        sections.fashion_colors_palette = createPaletteFromHex(color_palette_hex);
      }
      
      // Add final encouragement as reasoning
      sections.reasoning = data.final_encouragement || '';
      
    } else {
      // Fallback to old parsing logic if no JSON found
      sections = parseOldFormat(cleanedText);
    }
    
  } catch (error) {
    console.log('JSON parsing failed:', error.message);
    // Fallback to old parsing logic
    sections = parseOldFormat(cleanedText);
  }
  
  return sections;
}

function parseOldFormat(responseText) {
  const sections = {
    observations: {
      skin_tone: '',
      undertone: '',
      contrast: '',
      overall_type: ''
    },
    reasoning: '',
    fashion_colors: {
      excellent_choices: '',
      hair_colors: '',
      makeup: {
        blush: '',
        lipstick: '',
        eyeshadow: ''
      }
    },
    fashion_colors_palette: '',
    disclaimer: '',
    full_response: responseText
  };

  // Try to extract structured information
  const lines = responseText.split('\n');
  let current_section = null;
  let current_subsection = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Look for skin tone information
    if (trimmedLine.toLowerCase().includes('skin tone') || trimmedLine.toLowerCase().includes('skin:')) {
      sections.observations.skin_tone = trimmedLine.replace('*', '').trim();
    }
    // Look for undertone information
    else if (trimmedLine.toLowerCase().includes('undertone')) {
      sections.observations.undertone = trimmedLine.replace('*', '').trim();
    }
    // Look for contrast information
    else if (trimmedLine.toLowerCase().includes('contrast')) {
      sections.observations.contrast = trimmedLine.replace('*', '').trim();
    }
    // Look for overall type
    else if (['autumn', 'winter', 'spring', 'summer'].some(season => trimmedLine.toLowerCase().includes(season))) {
      if (['warm', 'true', 'deep', 'soft'].some(adj => trimmedLine.toLowerCase().includes(adj))) {
        sections.observations.overall_type = trimmedLine.replace('*', '').trim();
      }
    }
    // Look for reasoning section
    else if (trimmedLine.toLowerCase().includes("here's why") || trimmedLine.toLowerCase().includes("why:")) {
      current_section = 'reasoning';
    }
    // Look for fashion colors section
    else if (trimmedLine.toLowerCase().includes("fashion colors") || trimmedLine.toLowerCase().includes("recommendations") || trimmedLine.toLowerCase().includes("best colors")) {
      current_section = 'fashion_colors';
    }
    // Look for excellent choices subsection
    else if (trimmedLine.toLowerCase().includes("excellent choices") || trimmedLine.toLowerCase().includes("best choices") || trimmedLine.toLowerCase().includes("primary colors")) {
      current_section = 'fashion_colors';
      current_subsection = 'excellent_choices';
    }
    // Look for hair colors subsection
    else if (trimmedLine.toLowerCase().includes("hair color") || trimmedLine.toLowerCase().includes("hair:")) {
      current_section = 'fashion_colors';
      current_subsection = 'hair_colors';
    }
    // Look for makeup subsection
    else if (trimmedLine.toLowerCase().includes("makeup") || trimmedLine.toLowerCase().includes("cosmetics")) {
      current_section = 'fashion_colors';
      current_subsection = 'makeup';
    }
    // Look for makeup subsections
    else if (trimmedLine.toLowerCase().includes("blush")) {
      current_section = 'fashion_colors';
      current_subsection = 'makeup_blush';
    }
    else if (trimmedLine.toLowerCase().includes("lipstick") || trimmedLine.toLowerCase().includes("lips")) {
      current_section = 'fashion_colors';
      current_subsection = 'makeup_lipstick';
    }
    else if (trimmedLine.toLowerCase().includes("eyeshadow") || trimmedLine.toLowerCase().includes("eyes")) {
      current_section = 'fashion_colors';
      current_subsection = 'makeup_eyeshadow';
    }
    // Look for disclaimer
    else if (trimmedLine.toLowerCase().includes("disclaimer") || trimmedLine.toLowerCase().includes("note:") || trimmedLine.toLowerCase().includes("important:")) {
      current_section = 'disclaimer';
    }
    // Add content to current section
    else if (current_section === 'reasoning') {
      sections.reasoning += trimmedLine + '\n';
    }
    else if (current_section === 'fashion_colors') {
      if (current_subsection === 'excellent_choices') {
        sections.fashion_colors.excellent_choices += trimmedLine + '\n';
      }
      else if (current_subsection === 'hair_colors') {
        sections.fashion_colors.hair_colors += trimmedLine + '\n';
      }
      else if (current_subsection === 'makeup_blush') {
        sections.fashion_colors.makeup.blush += trimmedLine + '\n';
      }
      else if (current_subsection === 'makeup_lipstick') {
        sections.fashion_colors.makeup.lipstick += trimmedLine + '\n';
      }
      else if (current_subsection === 'makeup_eyeshadow') {
        sections.fashion_colors.makeup.eyeshadow += trimmedLine + '\n';
      }
      else if (current_subsection === 'makeup') {
        // General makeup content
        sections.fashion_colors.makeup.blush += trimmedLine + '\n';
        sections.fashion_colors.makeup.lipstick += trimmedLine + '\n';
        sections.fashion_colors.makeup.eyeshadow += trimmedLine + '\n';
      }
      else {
        // Default to excellent choices if no specific subsection
        sections.fashion_colors.excellent_choices += trimmedLine + '\n';
      }
    }
    else if (current_section === 'disclaimer') {
      sections.disclaimer += trimmedLine + '\n';
    }
  }
  
  return sections;
}

module.exports = {
  parseAnalysisResponse
}; 