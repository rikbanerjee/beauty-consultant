const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { analyzeImage } = require('./services/aiService');
const { parseAnalysisResponse } = require('./utils/parser');
const { createTestResponse } = require('./utils/testResponses');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
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
      return res.json({
        success: true,
        data: {
          ...testResponse,
          sections: testResponse.parsed_sections,
          observations: testResponse.parsed_sections.observations,
          reasoning: testResponse.parsed_sections.reasoning,
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
    const imagePath = req.file.path;
    const analysisResult = await analyzeImage(imagePath, aiProvider);
    
    // Parse the AI response into structured sections
    const parsedSections = parseAnalysisResponse(analysisResult.raw_response);
    
    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      data: {
        ...analysisResult,
        sections: parsedSections,
        observations: parsedSections.observations,
        reasoning: parsedSections.reasoning,
        fashionColors: parsedSections.fashion_colors,
        makeup: parsedSections.fashion_colors.makeup,
        disclaimer: parsedSections.disclaimer,
        fullResponse: parsedSections.full_response
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

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

app.listen(PORT, () => {
  console.log(`🚀 Beauty Consultant Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 