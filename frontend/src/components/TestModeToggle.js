import React from 'react';
import './TestModeToggle.css';

const TestModeToggle = ({ 
  testMode, 
  setTestMode, 
  testResponseType, 
  setTestResponseType 
}) => {
  return (
    <div className="test-mode-section">
      <div className="form-group">
        <label className="test-mode-toggle">
          <input 
            type="checkbox" 
            checked={testMode}
            onChange={(e) => setTestMode(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">🧪 Test Mode (No API Calls)</span>
        </label>
      </div>
      
      {testMode && (
        <div className="test-mode-options">
          <div className="form-group">
            <label htmlFor="testResponseType">Test Response Type:</label>
            <select 
              id="testResponseType"
              className="form-control"
              value={testResponseType}
              onChange={(e) => setTestResponseType(e.target.value)}
            >
              <option value="random">Random Response</option>
              <option value="warm_autumn">Warm Autumn</option>
              <option value="cool_winter">Cool Winter</option>
              <option value="soft_summer">Soft Summer</option>
              <option value="bright_spring">Bright Spring</option>
              <option value="deep_autumn">Deep Autumn</option>
              <option value="light_spring">Light Spring</option>
              <option value="error_response">Error Response</option>
              <option value="incomplete_response">Incomplete Response</option>
            </select>
          </div>
          <div className="test-mode-status">
            <span className={`status-indicator ${testMode ? 'active' : ''}`}>●</span>
            <span className="status-text">
              {testMode ? 'Test mode enabled' : 'Test mode disabled'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModeToggle; 