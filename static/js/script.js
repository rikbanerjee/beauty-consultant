// Global variables
let selectedFile = null;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsContent = document.getElementById('resultsContent');
const providerBadge = document.getElementById('providerBadge');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    setupFileInput();
});

// Drag and drop functionality
function setupDragAndDrop() {
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
}

// File input functionality
function setupFileInput() {
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

// Handle file selection
function handleFile(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showError('Please select a valid image file (JPEG, PNG, GIF, BMP, or WebP)');
        return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB');
        return;
    }

    selectedFile = file;
    displayImagePreview(file);
    analyzeBtn.disabled = false;
    hideResults();
}

// Display image preview
function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Remove image
function removeImage() {
    selectedFile = null;
    fileInput.value = '';
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    analyzeBtn.disabled = true;
    hideResults();
}

// Analyze image
async function analyzeImage() {
    if (!selectedFile) {
        showError('Please select an image first');
        return;
    }

    const llmProvider = document.getElementById('llmProvider').value;
    const customPrompt = document.getElementById('customPrompt').value;

    // Show loading state
    showLoading();
    analyzeBtn.disabled = true;

    try {
        let response;
        
        if (testModeEnabled) {
            // Use test endpoint
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('llm_provider', llmProvider);
            formData.append('custom_prompt', customPrompt);
            
            response = await fetch('/test-upload', {
                method: 'POST',
                body: formData
            });
        } else {
            // Use real API endpoint
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('llm_provider', llmProvider);
            formData.append('custom_prompt', customPrompt);
            
            response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
        }

        const data = await response.json();
        


        if (response.ok && data.success) {
            displayResults(data.analysis, data.provider, data.parsed_analysis);
        } else {
            showError(data.error || 'Analysis failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        hideLoading();
        analyzeBtn.disabled = false;
    }
}

// Show loading state
function showLoading() {
    resultsSection.style.display = 'block';
    loadingSpinner.style.display = 'block';
    resultsContent.style.display = 'none';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Display results
function displayResults(analysis, provider, parsedAnalysis) {
    // Update provider badge
    const providerName = provider === 'openai' ? 'OpenAI GPT-4' : provider === 'test_mode' ? 'Test Mode' : 'Google Gemini 2.0 Flash';
    providerBadge.textContent = providerName;
    
    // Display structured analysis if available
    if (parsedAnalysis && Object.keys(parsedAnalysis.observations).some(key => parsedAnalysis.observations[key])) {
        displayStructuredAnalysis(parsedAnalysis);
    } else {
        // Fallback to full analysis
        displayFullAnalysis(analysis);
    }
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display structured analysis
function displayStructuredAnalysis(parsedAnalysis) {
    const analysisSections = document.getElementById('analysisSections');
    const fullAnalysis = document.getElementById('fullAnalysis');
    const resultsContent = document.getElementById('resultsContent');
    
    // Make sure results content is visible
    resultsContent.style.display = 'block';
    
    // Hide full analysis, show structured sections
    fullAnalysis.style.display = 'none';
    analysisSections.style.display = 'block';
    
    // Force visibility with inline styles
    analysisSections.style.visibility = 'visible';
    analysisSections.style.opacity = '1';
    analysisSections.style.position = 'static';
    analysisSections.style.zIndex = '1';
    
    // Populate observations
    const observations = parsedAnalysis.observations;
    
    const skinToneElement = document.getElementById('skinTone');
    const undertoneElement = document.getElementById('undertone');
    const contrastElement = document.getElementById('contrast');
    const overallTypeElement = document.getElementById('overallType');
    
    if (skinToneElement) {
        skinToneElement.textContent = observations.skin_tone || 'Not detected';
    }
    if (undertoneElement) {
        undertoneElement.textContent = observations.undertone || 'Not detected';
    }
    if (contrastElement) {
        contrastElement.textContent = observations.contrast || 'Not detected';
    }
    if (overallTypeElement) {
        overallTypeElement.textContent = observations.overall_type || 'Not detected';
    }
    
    // Show reasoning section if available
    const reasoningSection = document.getElementById('reasoningSection');
    const reasoningContent = document.getElementById('reasoningContent');
    if (parsedAnalysis.reasoning && parsedAnalysis.reasoning.trim()) {
        reasoningContent.textContent = parsedAnalysis.reasoning.trim();
        reasoningSection.style.display = 'block';
    } else {
        reasoningSection.style.display = 'none';
    }
    
    // Show fashion colors section if available
    const fashionColorsSection = document.getElementById('fashionColorsSection');
    
    // Check if we have the new structured format or old format
    if (parsedAnalysis.fashion_colors && typeof parsedAnalysis.fashion_colors === 'object') {
        // New structured format
        const fashionColors = parsedAnalysis.fashion_colors;
        
        // Show Excellent Choices subsection
        const excellentChoicesSection = document.getElementById('excellentChoicesSection');
        const excellentChoicesContent = document.getElementById('excellentChoicesContent');
        const colorPaletteContainer = document.getElementById('colorPaletteContainer');
        
        if (fashionColors.excellent_choices && fashionColors.excellent_choices.trim()) {
            excellentChoicesContent.textContent = fashionColors.excellent_choices.trim();
            excellentChoicesSection.style.display = 'block';
        } else {
            excellentChoicesSection.style.display = 'none';
        }
        
        // Display color palette if available
        if (parsedAnalysis.fashion_colors_palette) {
            colorPaletteContainer.innerHTML = parsedAnalysis.fashion_colors_palette;
        } else {
            colorPaletteContainer.innerHTML = '';
        }
        
        // Show Hair Colors subsection
        const hairColorsSection = document.getElementById('hairColorsSection');
        const hairColorsContent = document.getElementById('hairColorsContent');
        
        if (fashionColors.hair_colors && fashionColors.hair_colors.trim()) {
            hairColorsContent.textContent = fashionColors.hair_colors.trim();
            hairColorsSection.style.display = 'block';
        } else {
            hairColorsSection.style.display = 'none';
        }
        
        // Show Makeup subsection
        const makeupSection = document.getElementById('makeupSection');
        const makeup = fashionColors.makeup;
        
        if (makeup && (makeup.blush || makeup.lipstick || makeup.eyeshadow)) {
            // Show Blush subsection
            const blushSection = document.getElementById('blushSection');
            const blushContent = document.getElementById('blushContent');
            
            if (makeup.blush && makeup.blush.trim()) {
                blushContent.textContent = makeup.blush.trim();
                blushSection.style.display = 'block';
            } else {
                blushSection.style.display = 'none';
            }
            
            // Show Lipstick subsection
            const lipstickSection = document.getElementById('lipstickSection');
            const lipstickContent = document.getElementById('lipstickContent');
            
            if (makeup.lipstick && makeup.lipstick.trim()) {
                lipstickContent.textContent = makeup.lipstick.trim();
                lipstickSection.style.display = 'block';
            } else {
                lipstickSection.style.display = 'none';
            }
            
            // Show Eyeshadow subsection
            const eyeshadowSection = document.getElementById('eyeshadowSection');
            const eyeshadowContent = document.getElementById('eyeshadowContent');
            
            if (makeup.eyeshadow && makeup.eyeshadow.trim()) {
                eyeshadowContent.textContent = makeup.eyeshadow.trim();
                eyeshadowSection.style.display = 'block';
            } else {
                eyeshadowSection.style.display = 'none';
            }
            
            makeupSection.style.display = 'block';
        } else {
            makeupSection.style.display = 'none';
        }
        
        fashionColorsSection.style.display = 'block';
    } else if (parsedAnalysis.fashion_colors && typeof parsedAnalysis.fashion_colors === 'string' && parsedAnalysis.fashion_colors.trim()) {
        // Old format - fallback
        const excellentChoicesSection = document.getElementById('excellentChoicesSection');
        const excellentChoicesContent = document.getElementById('excellentChoicesContent');
        const colorPaletteContainer = document.getElementById('colorPaletteContainer');
        
        excellentChoicesContent.textContent = parsedAnalysis.fashion_colors.trim();
        excellentChoicesSection.style.display = 'block';
        
        // Display color palette if available
        if (parsedAnalysis.fashion_colors_palette) {
            colorPaletteContainer.innerHTML = parsedAnalysis.fashion_colors_palette;
        } else {
            colorPaletteContainer.innerHTML = '';
        }
        
        fashionColorsSection.style.display = 'block';
    } else {
        fashionColorsSection.style.display = 'none';
    }
    
    // Show disclaimer section if available
    const disclaimerSection = document.getElementById('disclaimerSection');
    const disclaimerContent = document.getElementById('disclaimerContent');
    
    if (parsedAnalysis.disclaimer && parsedAnalysis.disclaimer.trim()) {
        disclaimerContent.textContent = parsedAnalysis.disclaimer.trim();
        disclaimerSection.style.display = 'block';
    } else {
        disclaimerSection.style.display = 'none';
    }
}

// Display full analysis (fallback)
function displayFullAnalysis(analysis) {
    const analysisSections = document.getElementById('analysisSections');
    const fullAnalysis = document.getElementById('fullAnalysis');
    const fullContent = document.getElementById('fullContent');
    
    // Hide structured sections, show full analysis
    analysisSections.style.display = 'none';
    fullAnalysis.style.display = 'block';
    fullContent.textContent = analysis;
}

// Hide results
function hideResults() {
    resultsSection.style.display = 'none';
}

// Show error message
function showError(message) {
    // Create a temporary error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e53e3e;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
        z-index: 1000;
        font-weight: 600;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for error notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Test mode functionality
let testModeEnabled = false;

// Add some helpful tooltips and interactions
document.addEventListener('DOMContentLoaded', function() {
    setupTestMode();
    
    // Add tooltip for custom prompt
    const customPromptTextarea = document.getElementById('customPrompt');
    customPromptTextarea.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Example: "Analyze the skin tone and suggest the best colors for summer clothing that would complement this person\'s complexion."';
        }
    });
    
    customPromptTextarea.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'Leave empty to use default skin tone analysis prompt...';
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!analyzeBtn.disabled) {
                analyzeImage();
            }
        }
        
        // Escape to remove image
        if (e.key === 'Escape' && selectedFile) {
            removeImage();
        }
    });
});

// Setup test mode functionality
function setupTestMode() {
    const testModeToggle = document.getElementById('testModeToggle');
    const testModeOptions = document.getElementById('testModeOptions');
    const testModeStatus = document.getElementById('testModeStatus');
    const statusIndicator = testModeStatus.querySelector('.status-indicator');
    const statusText = testModeStatus.querySelector('.status-text');
    
    // Check current test mode status
    checkTestModeStatus();
    
    // Toggle test mode
    testModeToggle.addEventListener('change', function() {
        const enabled = this.checked;
        const responseType = document.getElementById('testResponseType').value;
        
        if (enabled) {
            enableTestMode(responseType);
        } else {
            disableTestMode();
        }
    });
    
    // Update test mode when response type changes
    document.getElementById('testResponseType').addEventListener('change', function() {
        if (testModeEnabled) {
            enableTestMode(this.value);
        }
    });
}

// Check test mode status from server
async function checkTestModeStatus() {
    try {
        const response = await fetch('/test-mode');
        const data = await response.json();
        
        testModeEnabled = data.test_mode;
        document.getElementById('testModeToggle').checked = testModeEnabled;
        document.getElementById('testModeOptions').style.display = testModeEnabled ? 'block' : 'none';
        
        updateTestModeStatus(testModeEnabled, data.current_response_type);
    } catch (error) {
        console.error('Error checking test mode status:', error);
    }
}

// Enable test mode
async function enableTestMode(responseType) {
    try {
        const response = await fetch('/test-mode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'enable',
                response_type: responseType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            testModeEnabled = true;
            document.getElementById('testModeOptions').style.display = 'block';
            updateTestModeStatus(true, data.current_response_type);
            showNotification('Test mode enabled! 🧪', 'success');
        }
    } catch (error) {
        console.error('Error enabling test mode:', error);
        showNotification('Failed to enable test mode', 'error');
    }
}

// Disable test mode
async function disableTestMode() {
    try {
        const response = await fetch('/test-mode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'disable'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            testModeEnabled = false;
            document.getElementById('testModeOptions').style.display = 'none';
            updateTestModeStatus(false);
            showNotification('Test mode disabled! 🚀', 'success');
        }
    } catch (error) {
        console.error('Error disabling test mode:', error);
        showNotification('Failed to disable test mode', 'error');
    }
}

// Update test mode status display
function updateTestModeStatus(enabled, responseType = '') {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (enabled) {
        statusIndicator.textContent = '●';
        statusIndicator.className = 'status-indicator active';
        statusText.textContent = `Test mode active (${responseType.replace('_', ' ')})`;
    } else {
        statusIndicator.textContent = '●';
        statusIndicator.className = 'status-indicator';
        statusText.textContent = 'Test mode disabled';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#667eea'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
} 