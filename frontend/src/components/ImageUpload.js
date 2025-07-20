import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = ({ 
  onImageUpload, 
  onAnalyze, 
  selectedImage, 
  isLoading, 
  selectedProvider, 
  setSelectedProvider,
  customPrompt,
  setCustomPrompt
}) => {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload({ file, url: imageUrl });
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const handleRemoveImage = () => {
    if (selectedImage?.url) {
      URL.revokeObjectURL(selectedImage.url);
    }
    onImageUpload(null);
  };

  const handleAnalyze = () => {
    if (selectedImage?.file) {
      onAnalyze(selectedImage.file);
    } else {
      // For test mode, we can analyze without an image
      onAnalyze(null);
    }
  };

  return (
    <div className="image-upload">
      {!selectedImage ? (
        <div 
          {...getRootProps()} 
          className={`upload-area ${isDragActive ? 'dragover' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt"></i>
            <h3>Upload Your Photo</h3>
            <p>Drag and drop your image here or click to browse</p>
            <button className="upload-btn">
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="preview-area">
          <img 
            src={selectedImage.url} 
            alt="Preview" 
            className="uploaded-image"
          />
          <button className="remove-btn" onClick={handleRemoveImage}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="provider-selection">
        <h3>AI Model:</h3>
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
        <label htmlFor="customPrompt">Custom Prompt (Optional):</label>
        <textarea
          id="customPrompt"
          className="form-control"
          rows="4"
          placeholder="Leave empty to use default skin tone analysis prompt..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>

      <button 
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Analyzing...</span>
          </div>
        ) : (
          <>
            <i className="fas fa-magic"></i> Analyze Skin Tone
          </>
        )}
      </button>
    </div>
  );
};

export default ImageUpload; 