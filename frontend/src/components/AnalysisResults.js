import React, { useState } from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ results, isLoading, selectedProvider }) => {
  const [showFullResponse, setShowFullResponse] = useState(false);

  if (isLoading) {
    return (
      <div className="results-card">
        <div className="results-header">
          <h3>
            <i className="fas fa-chart-line"></i> Analysis Results
          </h3>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing your image...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-card">
        <div className="results-header">
          <h3>
            <i className="fas fa-chart-line"></i> Analysis Results
          </h3>
        </div>
        <div className="no-results">
          <div className="no-results-icon">
            <i className="fas fa-image"></i>
          </div>
          <p className="no-results-text">Upload an image to get started with your analysis</p>
        </div>
      </div>
    );
  }

  if (results.error) {
    return (
      <div className="results-card">
        <div className="results-header">
          <h3>
            <i className="fas fa-chart-line"></i> Analysis Results
          </h3>
        </div>
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{results.error}</span>
        </div>
      </div>
    );
  }

  // Extract data from the results
  const observations = results.observations || results.sections?.observations;
  const reasoning = results.reasoning || results.sections?.reasoning;
  const fashionColors = results.fashionColors || results.sections?.fashion_colors;
  const makeup = results.makeup || results.sections?.fashion_colors?.makeup;
  const disclaimer = results.disclaimer || results.sections?.disclaimer;
  const fullResponse = results.fullResponse || results.sections?.full_response;
  const colorPalette = results.sections?.fashion_colors_palette;

  return (
    <div className="results-card">
      <div className="results-header">
        <h3>
          <i className="fas fa-chart-line"></i> Analysis Results
        </h3>
        <div className="provider-badge">
          {selectedProvider === 'openai' ? 'OpenAI GPT-4' : 'Google Gemini'}
        </div>
      </div>

      <div className="results-content">
        <div className="analysis-sections">
          
          {/* Initial Observations Section */}
          {observations && (
            <div className="analysis-section observations-section">
              <h4>
                <i className="fas fa-eye section-icon"></i> Initial Observations
              </h4>
              <div className="observations-grid">
                {observations.skin_tone && (
                  <div className="observation-item">
                    <span className="label">Skin Tone:</span>
                    <span className="value">{observations.skin_tone}</span>
                  </div>
                )}
                {observations.undertone && (
                  <div className="observation-item">
                    <span className="label">Undertone:</span>
                    <span className="value">{observations.undertone}</span>
                  </div>
                )}
                {observations.contrast && (
                  <div className="observation-item">
                    <span className="label">Contrast:</span>
                    <span className="value">{observations.contrast}</span>
                  </div>
                )}
                {observations.overall_type && (
                  <div className="observation-item">
                    <span className="label">Overall Type:</span>
                    <span className="value">{observations.overall_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning Section */}
          {reasoning && (
            <div className="analysis-section reasoning-section">
              <h4>
                <i className="fas fa-lightbulb section-icon"></i> Here's Why
              </h4>
              <div className="section-content">{reasoning}</div>
            </div>
          )}

          {/* Fashion Colors Section */}
          {fashionColors && (
            <div className="analysis-section fashion-colors-section">
              <h4>
                <i className="fas fa-palette section-icon"></i> Fashion Colors
              </h4>
              
              {/* Excellent Choices Subsection */}
              {fashionColors.excellent_choices && (
                <div className="fashion-subsection">
                  <h5>
                    <i className="fas fa-star"></i> Excellent Choices
                  </h5>
                  <div className="subsection-content">
                    {fashionColors.excellent_choices}
                  </div>
                </div>
              )}

              {/* Color Palette */}
              {colorPalette && (
                <div className="color-palette-container" 
                     dangerouslySetInnerHTML={{ __html: colorPalette }}>
                </div>
              )}

              {/* Hair Colors Subsection */}
              {fashionColors.hair_colors && (
                <div className="fashion-subsection">
                  <h5>
                    <i className="fas fa-user-tie"></i> Hair Colors
                  </h5>
                  <div className="subsection-content">
                    {fashionColors.hair_colors}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Makeup Section */}
          {makeup && (
            <div className="analysis-section makeup-section">
              <h4>
                <i className="fas fa-magic section-icon"></i> Makeup
              </h4>
              
              {/* Foundation Subsection */}
              {makeup.foundation && (
                <div className="makeup-subsection">
                  <h6>
                    <i className="fas fa-palette"></i> Foundation
                  </h6>
                  <div className="subsection-content">{makeup.foundation}</div>
                </div>
              )}

              {/* Blush Subsection */}
              {makeup.blush && (
                <div className="makeup-subsection">
                  <h6>
                    <i className="fas fa-circle"></i> Blush
                  </h6>
                  <div className="subsection-content">{makeup.blush}</div>
                </div>
              )}

              {/* Lipstick Subsection */}
              {makeup.lipstick && (
                <div className="makeup-subsection">
                  <h6>
                    <i className="fas fa-kiss-wink-heart"></i> Lipstick
                  </h6>
                  <div className="subsection-content">{makeup.lipstick}</div>
                </div>
              )}

              {/* Eyeshadow Subsection */}
              {makeup.eyeshadow && (
                <div className="makeup-subsection">
                  <h6>
                    <i className="fas fa-eye"></i> Eyeshadow
                  </h6>
                  <div className="subsection-content">{makeup.eyeshadow}</div>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer Section */}
          {disclaimer && (
            <div className="analysis-section disclaimer-section">
              <h4>
                <i className="fas fa-exclamation-triangle section-icon"></i> Disclaimer
              </h4>
              <div className="section-content">{disclaimer}</div>
            </div>
          )}
        </div>

        {/* Full Response */}
        {fullResponse && (
          <div className="full-response">
            <div className="full-response-header">
              <h4 className="full-response-title">
                <i className="fas fa-file-alt"></i> Complete Analysis
              </h4>
              <button 
                className="toggle-button"
                onClick={() => setShowFullResponse(!showFullResponse)}
              >
                {showFullResponse ? 'Hide' : 'Show'} Full Response
              </button>
            </div>
            <div className={`full-response-content ${!showFullResponse ? 'collapsed' : ''}`}>
              {fullResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults; 