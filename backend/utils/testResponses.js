const { createPaletteFromHex } = require('./colorUtils');

function createTestResponse(responseType = 'warm_autumn') {
  const responses = {
    warm_autumn: {
      raw_response: `{
  "seasonal_type": "Warm Autumn",
  "analysis": {
    "skin_tone": "Medium skin tone with golden undertones",
    "undertone": "Warm",
    "contrast": "Medium to High"
  },
  "recommendations": {
    "fashion_colors": {
      "best_colors_description": "Embrace earthy, rich, and warm colors. Think of the colors of a forest in autumn. Your best colors include camel, olive green, chocolate brown, warm gray, ivory, mustard yellow, burnt orange, rust, forest green, teal, and tomato red. These colors will enhance your natural warmth and create a harmonious look.",
      "color_palette_hex": ["#C19A6B", "#6B8E23", "#7B3F00", "#8B7355", "#FFFFF0", "#FFD700", "#CC5500", "#B7410E"]
    },
    "hair_color": "For hair color, consider warm browns with golden undertones, rich auburn or copper tones, golden blonde highlights, or deep chocolate brown. Avoid cool tones like ash blonde or platinum as they may clash with your warm undertones.",
    "makeup": {
      "foundation": "Choose a foundation that matches your medium skin tone with warm, golden undertones. Look for formulas that enhance your natural warmth.",
      "blush": "Opt for warm, peachy tones like peach blush with golden undertones, terracotta or coral shades, and warm rose colors. Avoid cool pinks or mauve tones.",
      "lipstick": "Choose warm, rich lip colors such as terracotta or brick red, warm coral or peach, rich brown-based nudes, and golden orange tones. Avoid cool pinks or blue-based reds.",
      "eyeshadow": "Select warm, earthy eye colors including golden browns and bronzes, warm taupe and camel, terracotta and rust tones, and forest green and olive. Avoid cool grays or silver tones."
    }
  },
  "final_encouragement": "Your Warm Autumn coloring is absolutely stunning! These rich, earthy tones will make you glow and bring out the natural warmth in your features. Remember, confidence is your best accessory!"
}`,
      parsed_sections: {
        observations: {
          skin_tone: 'Medium skin tone with golden undertones',
          undertone: 'Warm',
          contrast: 'Medium to High',
          overall_type: 'Warm Autumn'
        },
        reasoning: 'Your Warm Autumn coloring is absolutely stunning! These rich, earthy tones will make you glow and bring out the natural warmth in your features. Remember, confidence is your best accessory!',
        fashion_colors: {
          excellent_choices: 'Embrace earthy, rich, and warm colors. Think of the colors of a forest in autumn. Your best colors include camel, olive green, chocolate brown, warm gray, ivory, mustard yellow, burnt orange, rust, forest green, teal, and tomato red. These colors will enhance your natural warmth and create a harmonious look.',
          hair_colors: 'For hair color, consider warm browns with golden undertones, rich auburn or copper tones, golden blonde highlights, or deep chocolate brown. Avoid cool tones like ash blonde or platinum as they may clash with your warm undertones.',
          makeup: {
            blush: 'Opt for warm, peachy tones like peach blush with golden undertones, terracotta or coral shades, and warm rose colors. Avoid cool pinks or mauve tones.',
            lipstick: 'Choose warm, rich lip colors such as terracotta or brick red, warm coral or peach, rich brown-based nudes, and golden orange tones. Avoid cool pinks or blue-based reds.',
            eyeshadow: 'Select warm, earthy eye colors including golden browns and bronzes, warm taupe and camel, terracotta and rust tones, and forest green and olive. Avoid cool grays or silver tones.'
          }
        },
        fashion_colors_palette: '',
        disclaimer: '',
        full_response: ''
      }
    },
    cool_winter: {
      raw_response: `{
  "seasonal_type": "Cool Winter",
  "analysis": {
    "skin_tone": "Fair to medium skin tone with cool undertones",
    "undertone": "Cool",
    "contrast": "High"
  },
  "recommendations": {
    "fashion_colors": {
      "best_colors_description": "Embrace bold, cool, and crisp colors. Think of jewel tones and pure colors. Your best colors include deep emerald green, royal blue, rich purple, true red, hot pink, pure white, charcoal gray, navy blue, black, and silver. These colors will enhance your natural coolness and create striking contrast.",
      "color_palette_hex": ["#006400", "#4169E1", "#800080", "#FF0000", "#FF69B4", "#FFFFFF", "#36454F", "#000080"]
    },
    "hair_color": "For hair color, consider cool browns with ashy undertones, platinum blonde, cool black, or silver gray. Avoid warm tones like golden blonde or copper as they may clash with your cool undertones.",
    "makeup": {
      "foundation": "Choose a foundation that matches your fair to medium skin tone with cool, pink undertones. Look for formulas that enhance your natural coolness.",
      "blush": "Opt for cool, pink tones like cool pink blush, berry shades, and cool rose colors. Avoid warm peach or coral tones.",
      "lipstick": "Choose cool, bold lip colors such as true red, berry shades, cool pinks, and cool mauve tones. Avoid warm orange or coral tones.",
      "eyeshadow": "Select cool, bold eye colors including cool grays, silvers, cool browns, and jewel tones like emerald and sapphire. Avoid warm gold or bronze tones."
    }
  },
  "final_encouragement": "Your Cool Winter coloring is absolutely striking! These bold, cool tones will make you stand out and create beautiful contrast. Your natural coolness is your superpower!"
}`,
      parsed_sections: {
        observations: {
          skin_tone: 'Fair to medium skin tone with cool undertones',
          undertone: 'Cool',
          contrast: 'High',
          overall_type: 'Cool Winter'
        },
        reasoning: 'Your Cool Winter coloring is absolutely striking! These bold, cool tones will make you stand out and create beautiful contrast. Your natural coolness is your superpower!',
        fashion_colors: {
          excellent_choices: 'Embrace bold, cool, and crisp colors. Think of jewel tones and pure colors. Your best colors include deep emerald green, royal blue, rich purple, true red, hot pink, pure white, charcoal gray, navy blue, black, and silver. These colors will enhance your natural coolness and create striking contrast.',
          hair_colors: 'For hair color, consider cool browns with ashy undertones, platinum blonde, cool black, or silver gray. Avoid warm tones like golden blonde or copper as they may clash with your cool undertones.',
          makeup: {
            blush: 'Opt for cool, pink tones like cool pink blush, berry shades, and cool rose colors. Avoid warm peach or coral tones.',
            lipstick: 'Choose cool, bold lip colors such as true red, berry shades, cool pinks, and cool mauve tones. Avoid warm orange or coral tones.',
            eyeshadow: 'Select cool, bold eye colors including cool grays, silvers, cool browns, and jewel tones like emerald and sapphire. Avoid warm gold or bronze tones.'
          }
        },
        fashion_colors_palette: '',
        disclaimer: '',
        full_response: ''
      }
    },
    soft_summer: {
      raw_response: `{
  "seasonal_type": "Soft Summer",
  "analysis": {
    "skin_tone": "Light to medium, with subtle variations in tone across the face.",
    "undertone": "Cool",
    "contrast": "Low"
  },
  "recommendations": {
    "fashion_colors": {
      "best_colors_description": "Soft Summer individuals are best suited to muted, cool-toned colors that are soft and delicate, avoiding anything too bright or saturated. Think dusty roses, muted mauves, soft blues, silvery grays, and gentle greens. These shades will enhance your natural, understated beauty and create a harmonious look. Avoid stark black and bright, clear colors as these can wash you out.",
      "color_palette_hex": ["#B297A8", "#93A1B0", "#6E7F8C", "#A5C2C3", "#A28D9E"]
    },
    "hair_color": "Consider soft, ash-blonde highlights to brighten your hair subtly, or shades of light brown with cool, muted undertones. Avoid overly warm or golden tones as these will clash with your cool undertones. A natural, slightly ashy brown would also look beautiful and enhance your features.",
    "makeup": {
      "foundation": "Opt for a lightweight, natural finish foundation in shades with a cool undertone. Match your foundation to your skin tone in natural light, avoiding anything too yellow or orange. Look for terms like \\"rose\\" or \\"porcelain\\" in the shade description.",
      "blush": "Use soft rosy pinks or muted mauve shades for blush. These will add a touch of color without being overwhelming. Avoid bright corals or peach tones.",
      "lipstick": "Rose, mauve, and muted berry shades will look flattering and enhance your natural lip color without appearing too bold or harsh. Look for sheer or satin finishes rather than matte or heavily pigmented.",
      "eyeshadow": "Choose soft, muted shades of grey, mauve, and muted blues. You can create a subtle smoky eye with these shades, or apply them individually to create a naturally enhanced look. Avoid bright, shimmery shades."
    }
  },
  "final_encouragement": "Your natural beauty is best showcased through soft, muted colours that complement your delicate features. Embrace your understated elegance!"
}`,
      parsed_sections: {
        observations: {
          skin_tone: 'Light to medium, with subtle variations in tone across the face.',
          undertone: 'Cool',
          contrast: 'Low',
          overall_type: 'Soft Summer'
        },
        reasoning: 'Your natural beauty is best showcased through soft, muted colours that complement your delicate features. Embrace your understated elegance!',
        fashion_colors: {
          excellent_choices: 'Soft Summer individuals are best suited to muted, cool-toned colors that are soft and delicate, avoiding anything too bright or saturated. Think dusty roses, muted mauves, soft blues, silvery grays, and gentle greens. These shades will enhance your natural, understated beauty and create a harmonious look. Avoid stark black and bright, clear colors as these can wash you out.',
          hair_colors: 'Consider soft, ash-blonde highlights to brighten your hair subtly, or shades of light brown with cool, muted undertones. Avoid overly warm or golden tones as these will clash with your cool undertones. A natural, slightly ashy brown would also look beautiful and enhance your features.',
          makeup: {
            blush: 'Use soft rosy pinks or muted mauve shades for blush. These will add a touch of color without being overwhelming. Avoid bright corals or peach tones.',
            lipstick: 'Rose, mauve, and muted berry shades will look flattering and enhance your natural lip color without appearing too bold or harsh. Look for sheer or satin finishes rather than matte or heavily pigmented.',
            eyeshadow: 'Choose soft, muted shades of grey, mauve, and muted blues. You can create a subtle smoky eye with these shades, or apply them individually to create a naturally enhanced look. Avoid bright, shimmery shades.'
          }
        },
        fashion_colors_palette: '',
        disclaimer: '',
        full_response: ''
      }
    }
  };

  const response = responses[responseType] || responses.warm_autumn;
  
  // Set the full_response to the raw_response for this specific type
  response.parsed_sections.full_response = response.raw_response;
  
  // Generate color palette from hex codes
  try {
    const jsonData = JSON.parse(response.raw_response);
    const color_palette_hex = jsonData.recommendations?.fashion_colors?.color_palette_hex || [];
    if (color_palette_hex.length > 0) {
      response.parsed_sections.fashion_colors_palette = createPaletteFromHex(color_palette_hex);
    }
  } catch (error) {
    console.log('Error generating color palette for test response:', error.message);
  }
  
  return response;
}

module.exports = {
  createTestResponse
}; 