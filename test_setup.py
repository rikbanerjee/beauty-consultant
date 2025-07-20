#!/usr/bin/env python3
"""
Test script to verify the setup of the Skin Tone Color Advisor application.
"""

import sys
import os

def test_imports():
    """Test if all required packages can be imported."""
    print("Testing imports...")
    
    try:
        import flask
        print("✓ Flask imported successfully")
    except ImportError as e:
        print(f"✗ Flask import failed: {e}")
        return False
    
    try:
        import openai
        print("✓ OpenAI imported successfully")
    except ImportError as e:
        print(f"✗ OpenAI import failed: {e}")
        return False
    
    try:
        import google.generativeai
        print("✓ Google Generative AI imported successfully")
    except ImportError as e:
        print(f"✗ Google Generative AI import failed: {e}")
        return False
    
    try:
        from PIL import Image
        print("✓ Pillow imported successfully")
    except ImportError as e:
        print(f"✗ Pillow import failed: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("✓ python-dotenv imported successfully")
    except ImportError as e:
        print(f"✗ python-dotenv import failed: {e}")
        return False
    
    return True

def test_file_structure():
    """Test if all required files and directories exist."""
    print("\nTesting file structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'README.md',
        'templates/index.html',
        'static/css/style.css',
        'static/js/script.js'
    ]
    
    required_dirs = [
        'templates',
        'static',
        'static/css',
        'static/js'
    ]
    
    all_good = True
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✓ {file_path} exists")
        else:
            print(f"✗ {file_path} missing")
            all_good = False
    
    for dir_path in required_dirs:
        if os.path.isdir(dir_path):
            print(f"✓ {dir_path}/ directory exists")
        else:
            print(f"✗ {dir_path}/ directory missing")
            all_good = False
    
    return all_good

def test_flask_app():
    """Test if the Flask app can be created without errors."""
    print("\nTesting Flask app creation...")
    
    try:
        # Temporarily disable environment variable loading
        os.environ['OPENAI_API_KEY'] = 'test'
        os.environ['GOOGLE_API_KEY'] = 'test'
        os.environ['SECRET_KEY'] = 'test'
        
        from app import app
        print("✓ Flask app created successfully")
        return True
    except Exception as e:
        print(f"✗ Flask app creation failed: {e}")
        return False

def test_environment_variables():
    """Test if environment variables are set."""
    print("\nTesting environment variables...")
    
    # Load .env file if it exists
    if os.path.exists('.env'):
        from dotenv import load_dotenv
        load_dotenv()
        print("✓ .env file found and loaded")
    else:
        print("⚠ .env file not found (you'll need to create one)")
    
    openai_key = os.environ.get('OPENAI_API_KEY')
    google_key = os.environ.get('GOOGLE_API_KEY')
    secret_key = os.environ.get('SECRET_KEY')
    
    if openai_key and openai_key != 'test':
        print("✓ OPENAI_API_KEY is set")
    else:
        print("⚠ OPENAI_API_KEY not set or is test value")
    
    if google_key and google_key != 'test':
        print("✓ GOOGLE_API_KEY is set")
    else:
        print("⚠ GOOGLE_API_KEY not set or is test value")
    
    if secret_key and secret_key != 'test':
        print("✓ SECRET_KEY is set")
    else:
        print("⚠ SECRET_KEY not set or is test value")

def main():
    """Run all tests."""
    print("=" * 50)
    print("Skin Tone Color Advisor - Setup Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 3
    
    if test_imports():
        tests_passed += 1
    
    if test_file_structure():
        tests_passed += 1
    
    if test_flask_app():
        tests_passed += 1
    
    test_environment_variables()
    
    print("\n" + "=" * 50)
    print(f"Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Your setup is ready.")
        print("\nNext steps:")
        print("1. Create a .env file with your API keys")
        print("2. Run: python app.py")
        print("3. Open http://localhost:5001 in your browser")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print("\nTo fix:")
        print("1. Install missing dependencies: pip install -r requirements.txt")
        print("2. Ensure all files are in the correct locations")
        print("3. Create a .env file with your API keys")
    
    print("=" * 50)

if __name__ == "__main__":
    main() 