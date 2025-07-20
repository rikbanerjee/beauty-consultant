# 🎨 Beauty Consultant - AI-Powered Skin Tone Analysis

A modern web application that uses AI to analyze skin tone and provide personalized color recommendations for fashion, hair, and makeup.

## ✨ Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 Vision and Google Gemini 2.0 Flash
- **JSON-Based Responses**: Structured data format for reliable parsing
- **Visual Color Palettes**: Interactive color swatches with hex codes
- **Comprehensive Recommendations**: Fashion colors, hair colors, and makeup suggestions
- **Test Mode**: Mock responses for development and testing
- **Modern UI**: Beautiful, responsive design with React
- **Easy Deployment**: Ready for hosting on various platforms

## 🏗️ Architecture

- **Frontend**: React.js with modern hooks and components
- **Backend**: Express.js with RESTful API
- **AI Integration**: OpenAI and Google Gemini APIs
- **Image Processing**: Sharp for optimization
- **Styling**: Modern CSS with responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rikbanerjee/beauty-consultant.git
   cd beauty-consultant
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your API keys
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

### Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
beauty-consultant/
├── backend/
│   ├── services/
│   │   └── aiService.js          # AI integration
│   ├── utils/
│   │   ├── parser.js             # Response parsing
│   │   ├── colorUtils.js         # Color utilities
│   │   └── testResponses.js      # Mock responses
│   ├── uploads/                  # Temporary image storage
│   ├── server.js                 # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TestModeToggle.js
│   │   │   ├── ImageUpload.js
│   │   │   └── AnalysisResults.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Backend API

- `GET /api/health` - Health check
- `GET /api/test-mode` - Get test mode info
- `POST /api/test-upload` - Test analysis endpoint
- `POST /api/analyze` - Main analysis endpoint

### Request Format

```javascript
// Image upload
const formData = new FormData();
formData.append('image', file);
formData.append('aiProvider', 'gemini'); // or 'openai'
formData.append('testMode', false);

// Test mode
{
  "responseType": "warm_autumn"
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "raw_response": "JSON string from AI",
    "parsed_sections": {
      "observations": {
        "skin_tone": "Medium",
        "undertone": "Warm",
        "contrast": "Medium to High",
        "overall_type": "Warm Autumn"
      },
      "reasoning": "Explanation...",
      "fashion_colors": {
        "excellent_choices": "Color recommendations...",
        "hair_colors": "Hair color suggestions...",
        "makeup": {
          "blush": "Blush recommendations...",
          "lipstick": "Lipstick suggestions...",
          "eyeshadow": "Eyeshadow advice..."
        }
      },
      "fashion_colors_palette": "HTML color swatches",
      "disclaimer": "Professional disclaimer"
    }
  }
}
```

## 🧪 Test Mode

The application includes a comprehensive test mode with mock responses for different skin tone types:

- **Warm Autumn**: Earthy, warm colors
- **Cool Winter**: Bold, cool jewel tones
- **Soft Summer**: Muted, cool colors
- **Bright Spring**: Vibrant, warm colors
- **Deep Autumn**: Rich, deep colors
- **Light Spring**: Light, bright colors
- **Error Response**: Simulates API errors
- **Incomplete Response**: Tests fallback handling

## 🎨 Color Palette System

The app generates visual color palettes from:
- **Hex codes** provided by AI responses
- **Text extraction** from color descriptions
- **Fallback colors** based on skin tone type

## 🚀 Deployment

### Backend Deployment

1. **Heroku**
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set GEMINI_API_KEY=your_key
   git push heroku main
   ```

2. **Railway**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Vercel**
   ```bash
   cd backend
   vercel
   ```

### Frontend Deployment

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Deploy to Netlify**
   ```bash
   netlify deploy
   ```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Start with nodemon
npm start    # Start production server
```

### Frontend Development

```bash
cd frontend
npm start    # Start development server
npm run build # Build for production
npm test     # Run tests
```

### Adding New Test Responses

1. Edit `backend/utils/testResponses.js`
2. Add new response type with JSON format
3. Include hex color codes for palette generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- OpenAI for GPT-4 Vision API
- Google for Gemini AI API
- React community for excellent tooling
- Color theory experts for guidance

## 📞 Support

For questions or support, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ for the beauty and fashion community** 