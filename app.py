import os
import base64
from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image
import io
import openai
import google.generativeai as genai
from dotenv import load_dotenv
from test_responses import test_mode, MockAnalysisResponses
from color_utils import extract_and_format_colors

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure OpenAI
openai.api_key = os.environ.get('OPENAI_API_KEY')

# Configure Google Gemini
genai.configure(api_key=os.environ.get('GOOGLE_API_KEY'))

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_with_openai(image_path, prompt):
    """Analyze image using OpenAI GPT-4 Vision"""
    try:
        base64_image = encode_image_to_base64(image_path)
        
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error analyzing with OpenAI: {str(e)}"

def analyze_with_gemini(image_path, prompt):
    """Analyze image using Google Gemini 2.0"""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Load image using PIL
        image = Image.open(image_path)
        
        response = model.generate_content([prompt, image])
        print("response: ", response.text)
        return response.text
    except Exception as e:
        return f"Error analyzing with Gemini: {str(e)}"

def parse_analysis_response(response_text):
    """Parse AI response into structured sections from JSON format"""
    import json
    
    # Default structure for fallback
    sections = {
        'observations': {
            'skin_tone': '',
            'undertone': '',
            'contrast': '',
            'overall_type': ''
        },
        'reasoning': '',
        'fashion_colors': {
            'excellent_choices': '',
            'hair_colors': '',
            'makeup': {
                'blush': '',
                'lipstick': '',
                'eyeshadow': ''
            }
        },
        'fashion_colors_palette': '',
        'disclaimer': '',
        'full_response': response_text
    }
    
    try:
        # Try to parse as JSON first
        # Look for JSON content in the response (might be wrapped in markdown or other text)
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start != -1 and json_end > json_start:
            json_content = response_text[json_start:json_end]
            data = json.loads(json_content)
            
            # Map JSON structure to our sections format
            sections['observations']['overall_type'] = data.get('seasonal_type', '')
            
            analysis = data.get('analysis', {})
            sections['observations']['skin_tone'] = analysis.get('skin_tone', '')
            sections['observations']['undertone'] = analysis.get('undertone', '')
            sections['observations']['contrast'] = analysis.get('contrast', '')
            
            recommendations = data.get('recommendations', {})
            fashion_colors = recommendations.get('fashion_colors', {})
            
            # Fashion colors
            sections['fashion_colors']['excellent_choices'] = fashion_colors.get('best_colors_description', '')
            
            # Hair colors
            sections['fashion_colors']['hair_colors'] = recommendations.get('hair_color', '')
            
            # Makeup
            makeup = recommendations.get('makeup', {})
            sections['fashion_colors']['makeup']['blush'] = makeup.get('blush', '')
            sections['fashion_colors']['makeup']['lipstick'] = makeup.get('lipstick', '')
            sections['fashion_colors']['makeup']['eyeshadow'] = makeup.get('eyeshadow', '')
            
            # Generate color palette from hex codes if available
            color_palette_hex = fashion_colors.get('color_palette_hex', [])
            if color_palette_hex:
                sections['fashion_colors_palette'] = create_palette_from_hex(color_palette_hex)
            else:
                # Fallback to text-based color extraction
                if sections['fashion_colors']['excellent_choices']:
                    _, palette_html = extract_and_format_colors(sections['fashion_colors']['excellent_choices'])
                    sections['fashion_colors_palette'] = palette_html
            
            # Add final encouragement as reasoning
            sections['reasoning'] = data.get('final_encouragement', '')
            
        else:
            # Fallback to old parsing logic if no JSON found
            sections = parse_old_format(response_text)
            
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"JSON parsing failed: {e}")
        # Fallback to old parsing logic
        sections = parse_old_format(response_text)
    
    return sections


def parse_old_format(response_text):
    """Fallback parsing for old text format"""
    sections = {
        'observations': {
            'skin_tone': '',
            'undertone': '',
            'contrast': '',
            'overall_type': ''
        },
        'reasoning': '',
        'fashion_colors': {
            'excellent_choices': '',
            'hair_colors': '',
            'makeup': {
                'blush': '',
                'lipstick': '',
                'eyeshadow': ''
            }
        },
        'fashion_colors_palette': '',
        'disclaimer': '',
        'full_response': response_text
    }
    
    # Try to extract structured information
    lines = response_text.split('\n')
    current_section = None
    current_subsection = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Look for skin tone information
        if 'skin tone' in line.lower() or 'skin:' in line.lower():
            sections['observations']['skin_tone'] = line.replace('*', '').strip()
        
        # Look for undertone information
        elif 'undertone' in line.lower():
            sections['observations']['undertone'] = line.replace('*', '').strip()
        
        # Look for contrast information
        elif 'contrast' in line.lower():
            sections['observations']['contrast'] = line.replace('*', '').strip()
        
        # Look for overall type (Warm Autumn, etc.)
        elif any(season in line.lower() for season in ['autumn', 'winter', 'spring', 'summer']):
            if 'warm' in line.lower() or 'true' in line.lower() or 'deep' in line.lower() or 'soft' in line.lower():
                sections['observations']['overall_type'] = line.replace('*', '').strip()
        
        # Look for reasoning section
        elif "here's why" in line.lower() or "why:" in line.lower():
            current_section = 'reasoning'
            current_subsection = None
        
        # Look for fashion colors section
        elif "fashion colors" in line.lower() or "recommendations" in line.lower() or "best colors" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = None
        
        # Look for excellent choices subsection
        elif "excellent choices" in line.lower() or "best choices" in line.lower() or "primary colors" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'excellent_choices'
        
        # Look for hair colors subsection
        elif "hair color" in line.lower() or "hair:" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'hair_colors'
        
        # Look for makeup subsection
        elif "makeup" in line.lower() or "cosmetics" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'makeup'
        
        # Look for makeup subsections
        elif "blush" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'makeup_blush'
        elif "lipstick" in line.lower() or "lips" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'makeup_lipstick'
        elif "eyeshadow" in line.lower() or "eyes" in line.lower():
            current_section = 'fashion_colors'
            current_subsection = 'makeup_eyeshadow'
        
        # Look for disclaimer
        elif "disclaimer" in line.lower() or "note:" in line.lower() or "important:" in line.lower():
            current_section = 'disclaimer'
            current_subsection = None
        
        # Add content to current section
        elif current_section == 'reasoning':
            sections['reasoning'] += line + '\n'
        elif current_section == 'fashion_colors':
            if current_subsection == 'excellent_choices':
                sections['fashion_colors']['excellent_choices'] += line + '\n'
            elif current_subsection == 'hair_colors':
                sections['fashion_colors']['hair_colors'] += line + '\n'
            elif current_subsection == 'makeup_blush':
                sections['fashion_colors']['makeup']['blush'] += line + '\n'
            elif current_subsection == 'makeup_lipstick':
                sections['fashion_colors']['makeup']['lipstick'] += line + '\n'
            elif current_subsection == 'makeup_eyeshadow':
                sections['fashion_colors']['makeup']['eyeshadow'] += line + '\n'
            elif current_subsection == 'makeup':
                # General makeup content
                sections['fashion_colors']['makeup']['blush'] += line + '\n'
                sections['fashion_colors']['makeup']['lipstick'] += line + '\n'
                sections['fashion_colors']['makeup']['eyeshadow'] += line + '\n'
            else:
                # Default to excellent choices if no specific subsection
                sections['fashion_colors']['excellent_choices'] += line + '\n'
        elif current_section == 'disclaimer':
            sections['disclaimer'] += line + '\n'
    
    # Generate color palette from excellent choices section
    if sections['fashion_colors']['excellent_choices']:
        _, palette_html = extract_and_format_colors(sections['fashion_colors']['excellent_choices'])
        sections['fashion_colors_palette'] = palette_html
    
    return sections


def create_palette_from_hex(hex_colors):
    """Create color palette HTML from hex color codes"""
    if not hex_colors:
        return ''
    
    html = '<div class="color-palette">'
    html += '<h5>Recommended Color Palette:</h5>'
    html += '<div class="color-swatches">'
    
    for i, hex_code in enumerate(hex_colors[:8]):  # Limit to 8 colors
        # Generate a color name based on the hex code
        color_name = f"Color {i+1}"
        
        html += f'''
            <div class="color-swatch" title="{color_name}">
                <div class="color-preview" style="background-color: {hex_code}"></div>
                <div class="color-name">{color_name}</div>
            </div>
        '''
    
    html += '</div></div>'
    return html

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    llm_provider = request.form.get('llm_provider', 'openai')
    custom_prompt = request.form.get('custom_prompt', '')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Default prompt for skin tone analysis
        default_prompt = """Analyze this image and provide detailed information about the person's skin tone. 
        Based on the skin tone analysis, suggest the best colors that would complement this skin tone for clothing, makeup, and accessories. 
        Please provide specific color recommendations with explanations for why these colors work well with this skin tone.
        Consider warm vs cool undertones and provide practical fashion advice."""
        
        prompt = custom_prompt if custom_prompt.strip() else default_prompt
        
        try:
            if llm_provider == 'openai':
                analysis = analyze_with_openai(filepath, prompt)
            elif llm_provider == 'gemini':
                analysis = analyze_with_gemini(filepath, prompt)
            else:
                return jsonify({'error': 'Invalid LLM provider'}), 400
            
            # Parse the analysis into structured sections
            parsed_analysis = parse_analysis_response(analysis)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'analysis': analysis,
                'parsed_analysis': parsed_analysis,
                'provider': llm_provider
            })
            
        except Exception as e:
            # Clean up uploaded file on error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Analysis failed: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/test-mode', methods=['GET', 'POST'])
def test_mode_endpoint():
    """Test mode endpoint for development."""
    if request.method == 'GET':
        return jsonify({
            'test_mode': test_mode.test_mode,
            'current_response_type': test_mode.current_response_type,
            'available_types': test_mode.get_available_response_types()
        })
    
    elif request.method == 'POST':
        data = request.get_json()
        action = data.get('action')
        response_type = data.get('response_type', 'random')
        
        if action == 'enable':
            test_mode.enable_test_mode(response_type)
            return jsonify({
                'success': True,
                'message': f'Test mode enabled with response type: {response_type}',
                'test_mode': True,
                'current_response_type': response_type
            })
        
        elif action == 'disable':
            test_mode.disable_test_mode()
            return jsonify({
                'success': True,
                'message': 'Test mode disabled',
                'test_mode': False
            })
        
        elif action == 'get_response':
            response = test_mode.get_test_response()
            return jsonify({
                'success': True,
                'response': response
            })
        
        return jsonify({'error': 'Invalid action'}), 400

@app.route('/test-upload', methods=['POST'])
def test_upload():
    """Test upload endpoint that uses mock responses."""
    if not test_mode.test_mode:
        return jsonify({'error': 'Test mode not enabled'}), 400
    
    # Simulate processing delay
    test_mode.simulate_api_delay(1)
    
    # Get test response
    test_response = test_mode.get_test_response()
    
    response_data = {
        'success': True,
        'analysis': test_response['raw_response'],
        'parsed_analysis': test_response['parsed_sections'],
        'provider': 'test_mode',
        'response_type': test_mode.current_response_type
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 