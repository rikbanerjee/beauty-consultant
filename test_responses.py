#!/usr/bin/env python3
"""
Test responses for the Skin Tone Color Advisor application.
This module provides mock responses to test the UI without making API calls.
"""

import json
import random
from datetime import datetime
from color_utils import extract_and_format_colors

class MockAnalysisResponses:
    """Mock responses for testing the skin tone analysis application."""
    
    def __init__(self):
        self.responses = {
            'warm_autumn': self._get_warm_autumn_response(),
            'cool_winter': self._get_cool_winter_response(),
            'soft_summer': self._get_soft_summer_response(),
            'soft_summer_real': self._get_soft_summer_real_response(),
            'bright_spring': self._get_bright_spring_response(),
            'deep_autumn': self._get_deep_autumn_response(),
            'light_spring': self._get_light_spring_response(),
            'error_response': self._get_error_response(),
            'incomplete_response': self._get_incomplete_response()
        }
    
    def get_response(self, response_type='random'):
        """Get a specific response or a random one."""
        if response_type == 'random':
            # Exclude error responses from random selection
            valid_types = [k for k in self.responses.keys() if 'error' not in k and 'incomplete' not in k]
            response_type = random.choice(valid_types)
        
        if response_type in self.responses:
            response = self.responses[response_type]
            
            # Generate color palette for fashion colors
            if response['parsed_sections']['fashion_colors']:
                if isinstance(response['parsed_sections']['fashion_colors'], dict):
                    # New structured format
                    excellent_choices = response['parsed_sections']['fashion_colors'].get('excellent_choices', '')
                    if excellent_choices:
                        _, palette_html = extract_and_format_colors(excellent_choices)
                        response['parsed_sections']['fashion_colors_palette'] = palette_html
                else:
                    # Old string format
                    _, palette_html = extract_and_format_colors(response['parsed_sections']['fashion_colors'])
                    response['parsed_sections']['fashion_colors_palette'] = palette_html
            
            return response
        else:
            return self.responses['warm_autumn']
    
    def get_all_response_types(self):
        """Get list of all available response types."""
        return list(self.responses.keys())
    
    def _get_warm_autumn_response(self):
        """Mock response for Warm Autumn skin tone."""
        return {
            'raw_response': """Okay, let's do a color analysis! I'm excited to help you discover your best colors.

From the image, I observe the following:

*   **Skin Tone:** Medium
*   **Undertone:** The skin seems to have a warm, golden undertone.
*   **Contrast:** There is a medium to high contrast between the hair, skin, and eyes.

Based on these observations, I believe you might be a **Warm Autumn** or a **True Autumn**.

**Here's why:**

*   **Warm Undertone:** The golden undertone of your skin aligns perfectly with the warmth of the Autumn seasons.
*   **Medium-High Contrast:** Autumns typically have medium to high contrast, which appears to be present in your features.

## **Recommendations for a Warm/True Autumn:**

Here's how to make the most of your natural coloring:

### **Fashion Colors:**

Embrace earthy, rich, and warm colors. Think of the colors of a forest in autumn.

*   **Neutrals:** Camel, olive green, chocolate brown, warm gray, and ivory.
*   **Colors:** Mustard yellow, burnt orange, rust, forest green, teal, and tomato red.

Here is a sample color palette to give you an idea:
- Primary: Warm browns, golden yellows, and rich oranges
- Secondary: Forest greens, teal blues, and warm reds
- Accents: Cream, beige, and warm grays""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Medium',
                    'undertone': 'Warm, golden undertone',
                    'contrast': 'Medium to high contrast',
                    'overall_type': 'Warm Autumn or True Autumn'
                },
                'reasoning': """*   **Warm Undertone:** The golden undertone of your skin aligns perfectly with the warmth of the Autumn seasons.
*   **Medium-High Contrast:** Autumns typically have medium to high contrast, which appears to be present in your features.""",
                'fashion_colors': {
                    'excellent_choices': """**Excellent Choices:**

Embrace earthy, rich, and warm colors. Think of the colors of a forest in autumn.

*   **Neutrals:** Camel, olive green, chocolate brown, warm gray, and ivory.
*   **Colors:** Mustard yellow, burnt orange, rust, forest green, teal, and tomato red.

Here is a sample color palette to give you an idea:
- Primary: Warm browns, golden yellows, and rich oranges
- Secondary: Forest greens, teal blues, and warm reds
- Accents: Cream, beige, and warm grays""",
                    'hair_colors': """**Hair Colors:**

For hair color, consider:
- Warm browns with golden undertones
- Rich auburn or copper tones
- Golden blonde highlights
- Deep chocolate brown
- Avoid cool tones like ash blonde or platinum""",
                    'makeup': {
                        'blush': """**Blush:**

Opt for warm, peachy tones:
- Peach blush with golden undertones
- Terracotta or coral shades
- Warm rose colors
- Avoid cool pinks or mauve tones""",
                        'lipstick': """**Lipstick:**

Choose warm, rich lip colors:
- Terracotta or brick red
- Warm coral or peach
- Rich brown-based nudes
- Golden orange tones
- Avoid cool pinks or blue-based reds""",
                        'eyeshadow': """**Eyeshadow:**

Select warm, earthy eye colors:
- Golden browns and bronzes
- Warm taupe and camel
- Terracotta and rust tones
- Forest green and olive
- Avoid cool grays or silver tones"""
                    }
                },
                'fashion_colors_palette': '',
                'disclaimer': """**Disclaimer:**

This analysis is based on the provided image and general color theory principles. Individual results may vary based on lighting conditions, camera settings, and personal preferences. For the most accurate color analysis, consider consulting with a professional color consultant in person. The recommendations provided are suggestions and should be adapted to your personal style and comfort level.""",
                'full_response': """Okay, let's do a color analysis! I'm excited to help you discover your best colors.

From the image, I observe the following:

*   **Skin Tone:** Medium
*   **Undertone:** The skin seems to have a warm, golden undertone.
*   **Contrast:** There is a medium to high contrast between the hair, skin, and eyes.

Based on these observations, I believe you might be a **Warm Autumn** or a **True Autumn**.

**Here's why:**

*   **Warm Undertone:** The golden undertone of your skin aligns perfectly with the warmth of the Autumn seasons.
*   **Medium-High Contrast:** Autumns typically have medium to high contrast, which appears to be present in your features.

## **Recommendations for a Warm/True Autumn:**

Here's how to make the most of your natural coloring:

### **Fashion Colors:**

Embrace earthy, rich, and warm colors. Think of the colors of a forest in autumn.

*   **Neutrals:** Camel, olive green, chocolate brown, warm gray, and ivory.
*   **Colors:** Mustard yellow, burnt orange, rust, forest green, teal, and tomato red.

Here is a sample color palette to give you an idea:
- Primary: Warm browns, golden yellows, and rich oranges
- Secondary: Forest greens, teal blues, and warm reds
- Accents: Cream, beige, and warm grays"""
            }
        }
    
    def _get_cool_winter_response(self):
        """Mock response for Cool Winter skin tone."""
        return {
            'raw_response': """Excellent! Let me analyze your skin tone and provide personalized color recommendations.

**Initial Observations:**

*   **Skin Tone:** Fair to Medium
*   **Undertone:** Cool, bluish undertone with pink or rosy tones
*   **Contrast:** High contrast between features
*   **Overall Type:** Cool Winter

**Here's why:**

*   **Cool Undertone:** Your skin has distinct cool, bluish undertones that are characteristic of Winter types
*   **High Contrast:** The strong contrast between your hair, skin, and eyes indicates a Winter classification
*   **Clarity:** Your features have a clear, crisp quality typical of Winter seasons

## **Color Recommendations for Cool Winter:**

### **Best Colors:**

**Jewel Tones:**
- Deep emerald green
- Royal blue
- Rich purple
- True red
- Hot pink

**Neutrals:**
- Pure white
- Charcoal gray
- Navy blue
- Black

**Accent Colors:**
- Silver metallics
- Icy blue
- Bright magenta
- Electric blue""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Fair to Medium',
                    'undertone': 'Cool, bluish undertone with pink or rosy tones',
                    'contrast': 'High contrast between features',
                    'overall_type': 'Cool Winter'
                },
                'reasoning': """*   **Cool Undertone:** Your skin has distinct cool, bluish undertones that are characteristic of Winter types
*   **High Contrast:** The strong contrast between your hair, skin, and eyes indicates a Winter classification
*   **Clarity:** Your features have a clear, crisp quality typical of Winter seasons""",
                'fashion_colors': """**Jewel Tones:**
- Deep emerald green
- Royal blue
- Rich purple
- True red
- Hot pink

**Neutrals:**
- Pure white
- Charcoal gray
- Navy blue
- Black

**Accent Colors:**
- Silver metallics
- Icy blue
- Bright magenta
- Electric blue""",
                'full_response': """Excellent! Let me analyze your skin tone and provide personalized color recommendations.

**Initial Observations:**

*   **Skin Tone:** Fair to Medium
*   **Undertone:** Cool, bluish undertone with pink or rosy tones
*   **Contrast:** High contrast between features
*   **Overall Type:** Cool Winter

**Here's why:**

*   **Cool Undertone:** Your skin has distinct cool, bluish undertones that are characteristic of Winter types
*   **High Contrast:** The strong contrast between your hair, skin, and eyes indicates a Winter classification
*   **Clarity:** Your features have a clear, crisp quality typical of Winter seasons

## **Color Recommendations for Cool Winter:**

### **Best Colors:**

**Jewel Tones:**
- Deep emerald green
- Royal blue
- Rich purple
- True red
- Hot pink

**Neutrals:**
- Pure white
- Charcoal gray
- Navy blue
- Black

**Accent Colors:**
- Silver metallics
- Icy blue
- Bright magenta
- Electric blue"""
            }
        }
    
    def _get_soft_summer_response(self):
        """Mock response for Soft Summer skin tone."""
        return {
            'raw_response': """Let me analyze your skin tone and provide you with personalized color recommendations.

**Analysis Results:**

*   **Skin Tone:** Light to Medium
*   **Undertone:** Cool undertone with a muted, soft quality
*   **Contrast:** Low to medium contrast
*   **Overall Type:** Soft Summer

**Here's why:**

*   **Soft Quality:** Your features have a gentle, muted appearance rather than sharp contrast
*   **Cool Undertone:** Your skin has cool undertones but they're not as intense as Winter types
*   **Muted Colors:** You look best in colors that are softened and slightly grayed

## **Color Recommendations for Soft Summer:**

### **Best Colors:**

**Soft Neutrals:**
- Soft white
- Light gray
- Muted navy
- Dusty rose

**Muted Colors:**
- Lavender
- Sage green
- Dusty blue
- Mauve
- Soft teal

**Avoid:**
- Bright, pure colors
- High contrast combinations
- Warm oranges and yellows""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Light to Medium',
                    'undertone': 'Cool undertone with a muted, soft quality',
                    'contrast': 'Low to medium contrast',
                    'overall_type': 'Soft Summer'
                },
                'reasoning': """*   **Soft Quality:** Your features have a gentle, muted appearance rather than sharp contrast
*   **Cool Undertone:** Your skin has cool undertones but they're not as intense as Winter types
*   **Muted Colors:** You look best in colors that are softened and slightly grayed""",
                'fashion_colors': """**Soft Neutrals:**
- Soft white
- Light gray
- Muted navy
- Dusty rose

**Muted Colors:**
- Lavender
- Sage green
- Dusty blue
- Mauve
- Soft teal

**Avoid:**
- Bright, pure colors
- High contrast combinations
- Warm oranges and yellows""",
                'full_response': """Let me analyze your skin tone and provide you with personalized color recommendations.

**Analysis Results:**

*   **Skin Tone:** Light to Medium
*   **Undertone:** Cool undertone with a muted, soft quality
*   **Contrast:** Low to medium contrast
*   **Overall Type:** Soft Summer

**Here's why:**

*   **Soft Quality:** Your features have a gentle, muted appearance rather than sharp contrast
*   **Cool Undertone:** Your skin has cool undertones but they're not as intense as Winter types
*   **Muted Colors:** You look best in colors that are softened and slightly grayed

## **Color Recommendations for Soft Summer:**

### **Best Colors:**

**Soft Neutrals:**
- Soft white
- Light gray
- Muted navy
- Dusty rose

**Muted Colors:**
- Lavender
- Sage green
- Dusty blue
- Mauve
- Soft teal

**Avoid:**
- Bright, pure colors
- High contrast combinations
- Warm oranges and yellows"""
            }
        }
    
    def _get_bright_spring_response(self):
        """Mock response for Bright Spring skin tone."""
        return {
            'raw_response': """Fantastic! Let me provide you with a comprehensive color analysis.

**Skin Tone Analysis:**

*   **Skin Tone:** Light to Medium
*   **Undertone:** Warm undertone with golden or peachy tones
*   **Contrast:** Medium to high contrast
*   **Overall Type:** Bright Spring

**Here's why:**

*   **Bright Quality:** Your features have a clear, bright appearance that can handle vivid colors
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Clarity:** You have enough contrast to wear bright, clear colors effectively

## **Color Recommendations for Bright Spring:**

### **Best Colors:**

**Bright Colors:**
- Coral
- Bright yellow
- Kelly green
- Bright blue
- Hot pink

**Neutrals:**
- Cream
- Light beige
- Warm white
- Light brown

**Accent Colors:**
- Gold metallics
- Bright orange
- Lime green
- Turquoise""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Light to Medium',
                    'undertone': 'Warm undertone with golden or peachy tones',
                    'contrast': 'Medium to high contrast',
                    'overall_type': 'Bright Spring'
                },
                'reasoning': """*   **Bright Quality:** Your features have a clear, bright appearance that can handle vivid colors
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Clarity:** You have enough contrast to wear bright, clear colors effectively""",
                'fashion_colors': """**Bright Colors:**
- Coral
- Bright yellow
- Kelly green
- Bright blue
- Hot pink

**Neutrals:**
- Cream
- Light beige
- Warm white
- Light brown

**Accent Colors:**
- Gold metallics
- Bright orange
- Lime green
- Turquoise""",
                'full_response': """Fantastic! Let me provide you with a comprehensive color analysis.

**Skin Tone Analysis:**

*   **Skin Tone:** Light to Medium
*   **Undertone:** Warm undertone with golden or peachy tones
*   **Contrast:** Medium to high contrast
*   **Overall Type:** Bright Spring

**Here's why:**

*   **Bright Quality:** Your features have a clear, bright appearance that can handle vivid colors
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Clarity:** You have enough contrast to wear bright, clear colors effectively

## **Color Recommendations for Bright Spring:**

### **Best Colors:**

**Bright Colors:**
- Coral
- Bright yellow
- Kelly green
- Bright blue
- Hot pink

**Neutrals:**
- Cream
- Light beige
- Warm white
- Light brown

**Accent Colors:**
- Gold metallics
- Bright orange
- Lime green
- Turquoise"""
            }
        }
    
    def _get_deep_autumn_response(self):
        """Mock response for Deep Autumn skin tone."""
        return {
            'raw_response': """Let me analyze your skin tone and provide detailed color recommendations.

**Analysis Results:**

*   **Skin Tone:** Medium to Deep
*   **Undertone:** Warm undertone with rich, deep qualities
*   **Contrast:** High contrast with deep, rich features
*   **Overall Type:** Deep Autumn

**Here's why:**

*   **Deep Quality:** Your features have a rich, deep appearance that can handle intense colors
*   **Warm Undertone:** Your skin has warm undertones that complement autumn colors
*   **Rich Contrast:** You have enough depth to wear rich, saturated colors effectively

## **Color Recommendations for Deep Autumn:**

### **Best Colors:**

**Rich Colors:**
- Deep burgundy
- Forest green
- Navy blue
- Chocolate brown
- Deep teal

**Neutrals:**
- Charcoal gray
- Deep brown
- Warm black
- Cream

**Accent Colors:**
- Gold metallics
- Deep orange
- Olive green
- Rich purple""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Medium to Deep',
                    'undertone': 'Warm undertone with rich, deep qualities',
                    'contrast': 'High contrast with deep, rich features',
                    'overall_type': 'Deep Autumn'
                },
                'reasoning': """*   **Deep Quality:** Your features have a rich, deep appearance that can handle intense colors
*   **Warm Undertone:** Your skin has warm undertones that complement autumn colors
*   **Rich Contrast:** You have enough depth to wear rich, saturated colors effectively""",
                'fashion_colors': """**Rich Colors:**
- Deep burgundy
- Forest green
- Navy blue
- Chocolate brown
- Deep teal

**Neutrals:**
- Charcoal gray
- Deep brown
- Warm black
- Cream

**Accent Colors:**
- Gold metallics
- Deep orange
- Olive green
- Rich purple""",
                'full_response': """Let me analyze your skin tone and provide detailed color recommendations.

**Analysis Results:**

*   **Skin Tone:** Medium to Deep
*   **Undertone:** Warm undertone with rich, deep qualities
*   **Contrast:** High contrast with deep, rich features
*   **Overall Type:** Deep Autumn

**Here's why:**

*   **Deep Quality:** Your features have a rich, deep appearance that can handle intense colors
*   **Warm Undertone:** Your skin has warm undertones that complement autumn colors
*   **Rich Contrast:** You have enough depth to wear rich, saturated colors effectively

## **Color Recommendations for Deep Autumn:**

### **Best Colors:**

**Rich Colors:**
- Deep burgundy
- Forest green
- Navy blue
- Chocolate brown
- Deep teal

**Neutrals:**
- Charcoal gray
- Deep brown
- Warm black
- Cream

**Accent Colors:**
- Gold metallics
- Deep orange
- Olive green
- Rich purple"""
            }
        }
    
    def _get_light_spring_response(self):
        """Mock response for Light Spring skin tone."""
        return {
            'raw_response': """Let me provide you with a comprehensive skin tone analysis.

**Analysis Results:**

*   **Skin Tone:** Light
*   **Undertone:** Warm undertone with golden or peachy tones
*   **Contrast:** Low to medium contrast
*   **Overall Type:** Light Spring

**Here's why:**

*   **Light Quality:** Your features have a light, delicate appearance
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Soft Contrast:** You have gentle contrast that works well with light, bright colors

## **Color Recommendations for Light Spring:**

### **Best Colors:**

**Light Colors:**
- Peach
- Light yellow
- Mint green
- Sky blue
- Light pink

**Neutrals:**
- Ivory
- Light beige
- Warm white
- Light gray

**Accent Colors:**
- Gold metallics
- Light coral
- Soft lavender
- Light mint""",
            
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Light',
                    'undertone': 'Warm undertone with golden or peachy tones',
                    'contrast': 'Low to medium contrast',
                    'overall_type': 'Light Spring'
                },
                'reasoning': """*   **Light Quality:** Your features have a light, delicate appearance
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Soft Contrast:** You have gentle contrast that works well with light, bright colors""",
                'fashion_colors': """**Light Colors:**
- Peach
- Light yellow
- Mint green
- Sky blue
- Light pink

**Neutrals:**
- Ivory
- Light beige
- Warm white
- Light gray

**Accent Colors:**
- Gold metallics
- Light coral
- Soft lavender
- Light mint""",
                'full_response': """Let me provide you with a comprehensive skin tone analysis.

**Analysis Results:**

*   **Skin Tone:** Light
*   **Undertone:** Warm undertone with golden or peachy tones
*   **Contrast:** Low to medium contrast
*   **Overall Type:** Light Spring

**Here's why:**

*   **Light Quality:** Your features have a light, delicate appearance
*   **Warm Undertone:** Your skin has warm undertones that complement spring colors
*   **Soft Contrast:** You have gentle contrast that works well with light, bright colors

## **Color Recommendations for Light Spring:**

### **Best Colors:**

**Light Colors:**
- Peach
- Light yellow
- Mint green
- Sky blue
- Light pink

**Neutrals:**
- Ivory
- Light beige
- Warm white
- Light gray

**Accent Colors:**
- Gold metallics
- Light coral
- Soft lavender
- Light mint"""
            }
        }
    
    def _get_soft_summer_real_response(self):
        """Mock response based on real AI analysis for Soft Summer."""
        response_text = """Alright, let's dive into your personal color analysis! It's so exciting to see how understanding your natural coloring can enhance your features.

From the image you've provided, here's my initial assessment:

*   **Skin Tone:** Your skin appears to be fair to light.
*   **Undertone:** It seems like you might have a neutral to slightly cool undertone. I am seeing some subtle rosy or pinkish tones in your skin.
*   **Contrast:** Your contrast level (difference between hair, skin, and eyes) appears to be medium.

Based on these observations, I believe you might be a **Soft Summer**. Soft Summers have a muted, cool, and delicate appearance.

**Let's explore the Soft Summer palette in more detail:**

**Fashion Colors:**

Think of colors like those found on a cloudy, misty day. Soft, muted blues, greens, pinks, and purples will be your best friends. Avoid anything too bright or warm, as it can overwhelm your delicate coloring.

*   **Excellent choices:** Foggy gray-blue, dusty rose, lavender, seafoam green, muted teal.

**Hair Color:**

*   **Natural:** Your current hair color seems to be in the right range.
*   **Dyed:** If you're considering dyeing your hair, stick with cool-toned browns or blondes with ashy undertones. Avoid anything too warm (like golden or reddish tones) as it might clash with your skin.

**Makeup:**

*   **Foundation:** Look for a foundation that matches your fair skin tone with a neutral or slightly cool undertone.
*   **Blush:** Soft, muted pinks or mauves will give you a natural, healthy glow.
*   **Lipstick:** Think berry shades, rose-toned nudes, and muted pinks. A sheer or satin finish will look more harmonious than a matte one.
*   **Eyeshadow:** Soft, cool-toned browns, grays, and taupes will enhance your eyes without being too overpowering. A touch of lavender or dusty rose can also look beautiful.

Remember, this is just a starting point. The best way to confirm your season is through a live or virtual draping session where you can see how different colors interact with your skin in real-time.

Would you be interested in exploring other possibilities or going deeper into the Soft Summer palette? I'm here to help!

**Disclaimer:** This analysis is based solely on the provided image and may not be 100% accurate. A professional, in-person color analysis is always recommended for the most precise results.
It is important to use the best colors that flatter you, even if they are not in your season.
It is also important to keep in mind that color analysis is only a tool and should be used as a guide, not a strict set of rules."""

        return {
            'raw_response': response_text,
            'parsed_sections': {
                'observations': {
                    'skin_tone': 'Fair to light',
                    'undertone': 'Neutral to slightly cool undertone with subtle rosy or pinkish tones',
                    'contrast': 'Medium contrast level',
                    'overall_type': 'Soft Summer'
                },
                'reasoning': """Based on these observations, I believe you might be a **Soft Summer**. Soft Summers have a muted, cool, and delicate appearance.

**Let's explore the Soft Summer palette in more detail:**""",
                'fashion_colors': {
                    'excellent_choices': """**Fashion Colors:**

Think of colors like those found on a cloudy, misty day. Soft, muted blues, greens, pinks, and purples will be your best friends. Avoid anything too bright or warm, as it can overwhelm your delicate coloring.

*   **Excellent choices:** Foggy gray-blue, dusty rose, lavender, seafoam green, muted teal.""",
                    'hair_colors': """**Hair Color:**

*   **Natural:** Your current hair color seems to be in the right range.
*   **Dyed:** If you're considering dyeing your hair, stick with cool-toned browns or blondes with ashy undertones. Avoid anything too warm (like golden or reddish tones) as it might clash with your skin.""",
                    'makeup': {
                        'blush': """**Blush:**

Soft, muted pinks or mauves will give you a natural, healthy glow.""",
                        'lipstick': """**Lipstick:**

Think berry shades, rose-toned nudes, and muted pinks. A sheer or satin finish will look more harmonious than a matte one.""",
                        'eyeshadow': """**Eyeshadow:**

Soft, cool-toned browns, grays, and taupes will enhance your eyes without being too overpowering. A touch of lavender or dusty rose can also look beautiful."""
                    }
                },
                'fashion_colors_palette': '',
                'disclaimer': """**Disclaimer:** This analysis is based solely on the provided image and may not be 100% accurate. A professional, in-person color analysis is always recommended for the most precise results.
It is important to use the best colors that flatter you, even if they are not in your season.
It is also important to keep in mind that color analysis is only a tool and should be used as a guide, not a strict set of rules.""",
                'full_response': response_text
            }
        }
    
    def _get_error_response(self):
        """Mock error response for testing error handling."""
        return {
            'raw_response': 'Error analyzing with Gemini: API rate limit exceeded. Please try again later.',
            'parsed_sections': {
                'observations': {
                    'skin_tone': '',
                    'undertone': '',
                    'contrast': '',
                    'overall_type': ''
                },
                'reasoning': '',
                'fashion_colors': '',
                'full_response': 'Error analyzing with Gemini: API rate limit exceeded. Please try again later.'
            }
        }
    
    def _get_incomplete_response(self):
        """Mock incomplete response for testing fallback handling."""
        return {
            'raw_response': """I can see your image, but I'm having trouble analyzing the specific details.

The lighting in the image makes it difficult to determine the exact skin tone characteristics.

Please try uploading a photo with better lighting, preferably in natural daylight.""",
            'parsed_sections': {
                'observations': {
                    'skin_tone': '',
                    'undertone': '',
                    'contrast': '',
                    'overall_type': ''
                },
                'reasoning': '',
                'fashion_colors': '',
                'full_response': """I can see your image, but I'm having trouble analyzing the specific details.

The lighting in the image makes it difficult to determine the exact skin tone characteristics.

Please try uploading a photo with better lighting, preferably in natural daylight."""
            }
        }


class TestMode:
    """Test mode utilities for development."""
    
    def __init__(self):
        self.mock_responses = MockAnalysisResponses()
        self.test_mode = False
        self.current_response_type = 'random'
    
    def enable_test_mode(self, response_type='random'):
        """Enable test mode with a specific response type."""
        self.test_mode = True
        self.current_response_type = response_type
        print(f"🧪 Test mode enabled with response type: {response_type}")
    
    def disable_test_mode(self):
        """Disable test mode."""
        self.test_mode = False
        print("🚀 Test mode disabled - using real API calls")
    
    def get_test_response(self):
        """Get a test response based on current settings."""
        return self.mock_responses.get_response(self.current_response_type)
    
    def get_available_response_types(self):
        """Get list of available test response types."""
        return self.mock_responses.get_all_response_types()
    
    def simulate_api_delay(self, delay_seconds=2):
        """Simulate API delay for realistic testing."""
        import time
        time.sleep(delay_seconds)


# Global test mode instance
test_mode = TestMode()


def get_test_response_info():
    """Get information about available test responses."""
    mock = MockAnalysisResponses()
    types = mock.get_all_response_types()
    
    print("🎨 Available Test Response Types:")
    print("=" * 50)
    
    for i, response_type in enumerate(types, 1):
        response = mock.get_response(response_type)
        skin_tone = response['parsed_sections']['observations']['skin_tone']
        overall_type = response['parsed_sections']['observations']['overall_type']
        
        print(f"{i:2d}. {response_type.replace('_', ' ').title()}")
        print(f"    Skin Tone: {skin_tone}")
        print(f"    Type: {overall_type}")
        print()
    
    print("Usage:")
    print("- test_mode.enable_test_mode('warm_autumn')")
    print("- test_mode.enable_test_mode('random')")
    print("- test_mode.disable_test_mode()")


if __name__ == "__main__":
    # Show available test responses
    get_test_response_info() 