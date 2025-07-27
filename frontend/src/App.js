import React, { useState } from 'react';
import TestModeToggle from './components/TestModeToggle';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import { isDevelopment, getDefaultProvider } from './utils/environment';
import './App.css';



function App() {
  const [testMode, setTestMode] = useState(false);
  const [testResponseType, setTestResponseType] = useState('random');
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(isDevelopment() ? 'openai' : getDefaultProvider());
  const [customPrompt, setCustomPrompt] = useState('');

  const handleImageUpload = (image) => {
    setSelectedImage(image);
    setAnalysisResults(null);
  };

  const handleAnalysis = async (imageFile) => {
    setIsLoading(true);
    setAnalysisResults(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('aiProvider', selectedProvider);
      formData.append('testMode', testMode);
      formData.append('testResponseType', testResponseType);
      
      // Only send custom prompt if user provided one
      if (customPrompt.trim()) {
        formData.append('customPrompt', customPrompt.trim());
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setAnalysisResults(responseData.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResults({
        error: 'Analysis failed. Please try again.',
        fullResponse: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        
        <header className="header">
          <h1>
            <i className="fas fa-palette"></i> Skin Tone Color Advisor
          </h1>
          <p>Upload your photo and get personalized color recommendations</p>
        </header>
 
        <main className="main-content">
          <div className={`upload-section ${isDevelopment() ? 'development' : ''}`}>
            <div className="upload-card">
              <ImageUpload 
                onImageUpload={handleImageUpload}
                onAnalyze={handleAnalysis}
                selectedImage={selectedImage}
                isLoading={isLoading}
                analysisResults={analysisResults}
              />
            </div>


          </div>

          <div className="results-section">
            <AnalysisResults 
              results={analysisResults}
              isLoading={isLoading}
              selectedProvider={selectedProvider}
            />
          </div>

          {isDevelopment() && (
            <div className="test-settings-section">
              <div className="settings-card">
                <h3>
                  <i className="fas fa-cog"></i> Analysis Settings
                </h3>
                
                <div className="provider-selection">
                  <h4>AI Model:</h4>
                  <div className="provider-options">
                    <label className={`provider-option ${selectedProvider === 'openai' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="provider"
                        value="openai"
                        checked={selectedProvider === 'openai'}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                      />
                      <span>OpenAI GPT-4 Vision</span>
                    </label>
                    <label className={`provider-option ${selectedProvider === 'gemini' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="provider"
                        value="gemini"
                        checked={selectedProvider === 'gemini'}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                      />
                      <span>Google Gemini 2.0 Flash</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="customPrompt">
                    <i className="fas fa-edit"></i> Custom Prompt (Optional)
                  </label>
                  <textarea
                    id="customPrompt"
                    className="form-control"
                    rows="4"
                    placeholder="Leave empty to use the secure professional skin tone analysis prompt. Enter custom instructions only if you need specific modifications."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                  {!customPrompt.trim() && (
                    <div className="prompt-info">
                      <i className="fas fa-shield-alt"></i>
                      <span>Using secure professional color analysis prompt</span>
                    </div>
                  )}
                </div>
                
                <TestModeToggle 
                  testMode={testMode}
                  setTestMode={setTestMode}
                  testResponseType={testResponseType}
                  setTestResponseType={setTestResponseType}
                />
              </div>
            </div>
          )}
        </main>
        
        <footer className="footer">
          <div className="powered-by">
            <span>Powered by:</span>
            <a 
              href="https://thecustomhub.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="company-link"
            >
              <div className="company-info">
                <img 
                  src="https://thecustomhub.com/cdn/shop/files/thecustomhub-logo.jpg?v=1737938203&width=180" 
                  alt="The CustomHub LLC Logo" 
                  className="company-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="company-name">The CustomHub</span>
              </div>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 