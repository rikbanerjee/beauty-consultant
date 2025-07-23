const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const { analyzeImage } = require('./services/aiService');
const { parseAnalysisResponse } = require('./utils/parser');
const { createTestResponse } = require('./utils/testResponses');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://beauty-consultant.vercel.app', 'https://thecustomhub.com'] 
    : 'http://localhost:3000',
  credentials: true
}));

// Allow iframe embedding from thecustomhub.com
app.use((req, res, next) => {
  // Remove default X-Frame-Options to allow iframe embedding
  res.removeHeader('X-Frame-Options');
  // Set Content-Security-Policy to allow iframe from thecustomhub.com
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://thecustomhub.com");
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for memory storage (Vercel serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});



// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Beauty Consultant API is running' });
});

// Test mode endpoints
app.get('/api/test-mode', (req, res) => {
  res.json({ 
    testMode: true,
    availableTypes: ['warm_autumn', 'cool_winter', 'soft_summer', 'bright_spring', 'deep_autumn', 'light_spring', 'error_response', 'incomplete_response']
  });
});

app.post('/api/test-upload', (req, res) => {
  try {
    const { responseType = 'warm_autumn' } = req.body;
    const testResponse = createTestResponse(responseType);
    
    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        data: testResponse
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Main analysis endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const { aiProvider = 'gemini', testMode = false, testResponseType = 'warm_autumn' } = req.body;

    // Handle test mode
    if (testMode === 'true' || testMode === true) {
      const testResponse = createTestResponse(testResponseType);
      
      // Check if this is a clarifying question test response
      if (testResponseType === 'clarifying_question') {
        return res.json({
          success: true,
          data: {
            error: testResponse.parsed_sections.error,
            question: testResponse.parsed_sections.question,
            fullResponse: testResponse.raw_response
          }
        });
      }
      
      return res.json({
        success: true,
        data: {
          ...testResponse,
          sections: testResponse.parsed_sections,
          observations: testResponse.parsed_sections.observations,
          reasoning: testResponse.parsed_sections.reasoning,
          finalEncouragement: testResponse.parsed_sections.final_encouragement,
          fashionColors: testResponse.parsed_sections.fashion_colors,
          makeup: testResponse.parsed_sections.fashion_colors.makeup,
          disclaimer: testResponse.parsed_sections.disclaimer,
          fullResponse: testResponse.raw_response
        }
      });
    }

    // Check if file is required for real AI analysis
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Real AI analysis
    const imageBuffer = req.file.buffer;
    const customPrompt = req.body.customPrompt;
    const analysisResult = await analyzeImage(imageBuffer, aiProvider, customPrompt);
    
    // Parse the AI response into structured sections
    const parsedSections = parseAnalysisResponse(analysisResult.raw_response);

    // Check if the parsed response contains an error (like clarifying question)
    if (parsedSections.error) {
      res.json({
        success: true,
        data: {
          ...analysisResult,
          error: parsedSections.error,
          question: parsedSections.question,
          fullResponse: parsedSections.full_response
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          ...analysisResult,
          sections: parsedSections,
          observations: parsedSections.observations,
          reasoning: parsedSections.reasoning,
          finalEncouragement: parsedSections.final_encouragement,
          fashionColors: parsedSections.fashion_colors,
          makeup: parsedSections.fashion_colors.makeup,
          disclaimer: parsedSections.disclaimer,
          fullResponse: parsedSections.full_response
        }
      });
    }

  } catch (error) {
    console.error('Analysis error:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Export for Vercel
module.exports = app;

// Start server if running directly (not in Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Beauty Consultant API server running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
  });
} 