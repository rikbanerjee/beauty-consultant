# Skin Tone Color Advisor

A modern web application that analyzes skin tone from uploaded images and provides personalized color recommendations using AI models (OpenAI GPT-4 Vision or Google Gemini 2.0).

## Features

- 🖼️ **Image Upload**: Drag & drop or click to upload images
- 🤖 **AI Analysis**: Choose between OpenAI GPT-4 Vision or Google Gemini 2.0
- 🎨 **Color Recommendations**: Get personalized color suggestions for clothing, makeup, and accessories
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Analysis**: Fast processing with loading indicators
- 🔧 **Custom Prompts**: Option to provide custom analysis prompts

## Screenshots

The application features a modern, beautiful UI with:
- Gradient background in blues and purples
- Clean, card-based layout
- Smooth animations and transitions
- Professional color scheme (avoiding orange as requested)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dress-selector
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# API Keys for LLM Services
# Get your OpenAI API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Get your Google API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_api_key_here

# Flask Secret Key (generate a random one for production)
SECRET_KEY=your_secret_key_here
```

### 4. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5001`

## Usage

1. **Upload Image**: Drag and drop an image or click to browse
2. **Choose AI Model**: Select between OpenAI GPT-4 Vision or Google Gemini 2.0
3. **Custom Prompt** (Optional): Provide a custom prompt or use the default skin tone analysis
4. **Analyze**: Click "Analyze Skin Tone" to get personalized recommendations
5. **View Results**: See detailed color recommendations and fashion advice

## API Endpoints

- `GET /`: Main application page
- `POST /upload`: Upload and analyze image
  - Parameters:
    - `file`: Image file
    - `llm_provider`: 'openai' or 'gemini'
    - `custom_prompt`: Optional custom prompt

## Technical Details

### Backend (Flask)
- **Framework**: Flask 2.3.3
- **Image Processing**: Pillow
- **AI Integration**: OpenAI API, Google Generative AI
- **File Handling**: Secure file uploads with validation

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS with async/await
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

### Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- BMP
- WebP

### File Size Limit
- Maximum file size: 16MB

## Default Analysis Prompt

The application uses this default prompt for skin tone analysis:

```
Analyze this image and provide detailed information about the person's skin tone. 
Based on the skin tone analysis, suggest the best colors that would complement this skin tone for clothing, makeup, and accessories. 
Please provide specific color recommendations with explanations for why these colors work well with this skin tone.
Consider warm vs cool undertones and provide practical fashion advice.
```

## Customization

### Changing the Default Prompt
Edit the `default_prompt` variable in `app.py` to modify the default analysis prompt.

### Styling
Modify `static/css/style.css` to customize the appearance. The current design uses:
- Primary colors: Blues and purples (#667eea, #764ba2)
- Accent colors: Teals and greens (#48bb78, #38a169)
- Background: Gradient from blue to purple

### Adding New AI Providers
To add support for additional AI providers:
1. Add the provider's API client to `requirements.txt`
2. Create a new analysis function in `app.py`
3. Update the upload endpoint to handle the new provider
4. Add the provider option to the frontend dropdown

## Security Considerations

- File upload validation (type and size)
- Secure filename handling
- Automatic file cleanup after processing
- Environment variable configuration
- CORS protection (if needed)

## Production Deployment

For production deployment:

1. **Set Environment Variables**: Use proper secret management
2. **Use WSGI Server**: Deploy with Gunicorn or uWSGI
3. **Add HTTPS**: Use SSL certificates
4. **Configure Logging**: Add proper logging
5. **Set Debug Mode**: Set `debug=False` in production
6. **Add Rate Limiting**: Implement API rate limiting
7. **Database**: Consider adding a database for user management

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are correctly set in the `.env` file
2. **File Upload Issues**: Check file size and format restrictions
3. **Network Errors**: Verify internet connection and API service status
4. **Port Conflicts**: Change the port in `app.py` if 5000 is in use

### Error Messages

- "Invalid file type": Upload a supported image format
- "File size too large": Reduce image size (max 16MB)
- "Analysis failed": Check API keys and internet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the error logs
3. Create an issue in the repository

---

**Note**: This application requires valid API keys for OpenAI and/or Google Gemini to function. Make sure to keep your API keys secure and never commit them to version control. 