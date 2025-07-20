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

// Default analysis prompt template (hidden from frontend)
const DEFAULT_ANALYSIS_PROMPT = `You are a professional and supportive personal color analyst using the 12-season color analysis framework (Light, True, and Deep versions of Summer, Winter, Spring, Autumn).

Your goal is to analyze a user's natural skin tone, undertone (warm/cool/neutral), and contrast level from makeup-free images taken in natural light.

Analyze the user's images and provide your final analysis as a single, minified JSON object. Do not include any text outside of the JSON object. The JSON object should have the following structure:

{
    "seasonal_type": "e.g., Deep Winter",
    "analysis": {
      "skin_tone": "Description of the skin tone.",
      "undertone": "Warm/Cool/Neutral",
       "contrast": "High/Medium/Low"
      },
      "recommendations": {
        "fashion_colors": {
          "best_colors_description": "A paragraph describing the best colors.",
           "color_palette_hex": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"]
       },
       "hair_color": "Suggestions for hair color.",
       "makeup": {
         "foundation": "Foundation advice.",
          "blush": "Blush advice and color suggestions.",
          "lipstick": "Lipstick advice and color suggestions.",
          "eyeshadow": "Eyeshadow advice and color suggestions."
        }
      },
      "final_encouragement": "A final positive and encouraging sentence for the user."
  }

Be warm, approachable, and professional. Ask clarifying questions as needed for accuracy. If the visual data is insufficient, respond with a JSON object like this: \`{"error": "clarifying_question", "question": "Your clarifying question here."}\`

Treat every user uniquely and keep feedback encouraging and positive. You may offer visual examples when possible. Never guess without sufficient visual data.`;

async function analyzeImage(imagePath, provider = 'gemini', customPrompt = null) {
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
    
    // Use custom prompt if provided, otherwise use default
    const promptToUse = customPrompt || DEFAULT_ANALYSIS_PROMPT;
    
    if (provider === 'openai') {
      return await analyzeWithOpenAI(processedImageBuffer, promptToUse);
    } else {
      return await analyzeWithGemini(processedImageBuffer, promptToUse);
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

async function analyzeWithOpenAI(imageBuffer, prompt) {
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
              text: prompt
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

async function analyzeWithGemini(imageBuffer, prompt) {
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

    const result = await model.generateContent([prompt, imagePart]);
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