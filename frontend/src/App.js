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
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                analysisResults={analysisResults}
              />
            </div>

            {isDevelopment() && (
              <div className="settings-card">
                <h3>
                  <i className="fas fa-cog"></i> Analysis Settings
                </h3>
                
                <TestModeToggle 
                  testMode={testMode}
                  setTestMode={setTestMode}
                  testResponseType={testResponseType}
                  setTestResponseType={setTestResponseType}
                />
              </div>
            )}
          </div>

          <div className="results-section">
            <AnalysisResults 
              results={analysisResults}
              isLoading={isLoading}
              selectedProvider={selectedProvider}
            />
          </div>
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