const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sharp = require('sharp');
const fs = require('fs');

// Initialize AI clients conditionally
let openai = null;
let genAI = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Analysis prompt template
const ANALYSIS_PROMPT = `You are a professional color analyst and beauty consultant. Analyze the provided image to determine the person's skin tone, undertone, contrast level, and seasonal color type.

Please provide your analysis in the following JSON format:

{
  "seasonal_type": "e.g., Deep Winter, Warm Autumn, Soft Summer, Bright Spring",
  "analysis": {
    "skin_tone": "Description of the skin tone (fair, light, medium, deep, etc.)",
    "undertone": "Warm/Cool/Neutral",
    "contrast": "High/Medium/Low"
  },
  "recommendations": {
    "fashion_colors": {
      "best_colors_description": "A detailed paragraph describing the best colors for this person, including specific color names and why they work well.",
      "color_palette_hex": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"]
    },
    "hair_color": "Specific suggestions for hair color, including natural and dyed options, with explanations for why these work well.",
    "makeup": {
      "foundation": "Foundation advice including shade matching and formula recommendations.",
      "blush": "Blush advice and specific color suggestions with explanations.",
      "lipstick": "Lipstick advice and specific color suggestions with explanations.",
      "eyeshadow": "Eyeshadow advice and specific color suggestions with explanations."
    }
  },
  "final_encouragement": "A final positive and encouraging sentence for the user about their natural beauty and color choices."
}

Important guidelines:
- Be specific and detailed in your recommendations
- Include actual hex color codes for the color palette
- Consider lighting conditions in the image
- Provide practical, actionable advice
- Be encouraging and positive
- Focus on enhancing natural beauty

Respond only with the JSON object, no additional text.`;

async function analyzeImage(imagePath, provider = 'gemini') {
  try {
    // Check if API keys are available
    if (provider === 'openai' && !openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable or use test mode.');
    }
    
    if (provider === 'gemini' && !genAI) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable or use test mode.');
    }
    
    // Process image for AI compatibility
    const processedImageBuffer = await processImageForAI(imagePath);
    
    if (provider === 'openai') {
      return await analyzeWithOpenAI(processedImageBuffer);
    } else {
      return await analyzeWithGemini(processedImageBuffer);
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error(`Error analyzing with ${provider}: ${error.message}`);
  }
}

async function processImageForAI(imagePath) {
  try {
    // Use sharp to process and optimize the image
    const processedBuffer = await sharp(imagePath)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image for AI analysis');
  }
}

async function analyzeWithOpenAI(imageBuffer) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY environment variable.');
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: ANALYSIS_PROMPT
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const analysisText = response.choices[0].message.content;
    console.log("OpenAI response:", analysisText);
    
    return {
      raw_response: analysisText,
      provider: 'openai'
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
}

async function analyzeWithGemini(imageBuffer) {
  if (!genAI) {
    throw new Error('Gemini client not initialized. Please set GEMINI_API_KEY environment variable.');
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: "image/jpeg"
      }
    };

    const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
    const response = await result.response;
    const analysisText = response.text();
    
    console.log("Gemini response:", analysisText);
    
    return {
      raw_response: analysisText,
      provider: 'gemini'
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
}

module.exports = {
  analyzeImage
}; 