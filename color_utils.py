#!/usr/bin/env python3
"""
Color utilities for the Skin Tone Color Advisor application.
Handles color name to hex mapping and palette generation.
"""

import re
import random
from typing import List, Dict, Tuple

class ColorPalette:
    """Color palette management for skin tone analysis."""
    
    def __init__(self):
        self.color_mapping = {
            # Warm Autumn Colors
            'camel': '#C19A6B',
            'olive green': '#6B8E23',
            'chocolate brown': '#7B3F00',
            'warm gray': '#8B7355',
            'ivory': '#FFFFF0',
            'mustard yellow': '#FFD700',
            'burnt orange': '#CC5500',
            'rust': '#B7410E',
            'forest green': '#228B22',
            'teal': '#008080',
            'tomato red': '#FF6347',
            'warm brown': '#8B4513',
            'golden yellow': '#FFD700',
            'rich orange': '#FF8C00',
            
            # Cool Winter Colors
            'deep emerald green': '#006400',
            'royal blue': '#4169E1',
            'rich purple': '#800080',
            'true red': '#FF0000',
            'hot pink': '#FF69B4',
            'pure white': '#FFFFFF',
            'charcoal gray': '#36454F',
            'navy blue': '#000080',
            'black': '#000000',
            'silver': '#C0C0C0',
            'icy blue': '#87CEEB',
            'bright magenta': '#FF00FF',
            'electric blue': '#00BFFF',
            
            # Soft Summer Colors
            'soft white': '#F5F5F5',
            'light gray': '#D3D3D3',
            'muted navy': '#2F4F4F',
            'dusty rose': '#DC143C',
            'lavender': '#E6E6FA',
            'sage green': '#9DC183',
            'dusty blue': '#4682B4',
            'mauve': '#E0B0FF',
            'soft teal': '#20B2AA',
            
            # Bright Spring Colors
            'coral': '#FF7F50',
            'bright yellow': '#FFFF00',
            'kelly green': '#4CBB17',
            'bright blue': '#0000FF',
            'hot pink': '#FF69B4',
            'cream': '#FFFDD0',
            'light beige': '#F5F5DC',
            'warm white': '#FAFAFA',
            'light brown': '#A0522D',
            'gold': '#FFD700',
            'bright orange': '#FFA500',
            'lime green': '#32CD32',
            'turquoise': '#40E0D0',
            
            # Deep Autumn Colors
            'deep burgundy': '#800020',
            'forest green': '#228B22',
            'navy blue': '#000080',
            'chocolate brown': '#7B3F00',
            'deep teal': '#008080',
            'charcoal gray': '#36454F',
            'deep brown': '#654321',
            'warm black': '#1C1C1C',
            'deep orange': '#FF8C00',
            'olive green': '#6B8E23',
            'rich purple': '#800080',
            
            # Light Spring Colors
            'peach': '#FFCBA4',
            'light yellow': '#FFFFE0',
            'mint green': '#98FF98',
            'sky blue': '#87CEEB',
            'light pink': '#FFB6C1',
            'ivory': '#FFFFF0',
            'light beige': '#F5F5DC',
            'warm white': '#FAFAFA',
            'light gray': '#D3D3D3',
            'light coral': '#F08080',
            'soft lavender': '#E6E6FA',
            'light mint': '#98FF98',
            
            # Neutral Colors
            'gray': '#808080',
            'beige': '#F5F5DC',
            'tan': '#D2B48C',
            'cream': '#FFFDD0',
            'white': '#FFFFFF',
            'off-white': '#FAFAFA',
            'light gray': '#D3D3D3',
            'medium gray': '#A9A9A9',
            'dark gray': '#696969',
        }
        
        # Color categories for different skin tones
        self.color_categories = {
            'warm_autumn': [
                'camel', 'olive green', 'chocolate brown', 'warm gray', 'ivory',
                'mustard yellow', 'burnt orange', 'rust', 'forest green', 'teal', 'tomato red'
            ],
            'cool_winter': [
                'deep emerald green', 'royal blue', 'rich purple', 'true red', 'hot pink',
                'pure white', 'charcoal gray', 'navy blue', 'black', 'silver', 'icy blue'
            ],
            'soft_summer': [
                'soft white', 'light gray', 'muted navy', 'dusty rose', 'lavender',
                'sage green', 'dusty blue', 'mauve', 'soft teal'
            ],
            'bright_spring': [
                'coral', 'bright yellow', 'kelly green', 'bright blue', 'hot pink',
                'cream', 'light beige', 'warm white', 'light brown', 'gold'
            ],
            'deep_autumn': [
                'deep burgundy', 'forest green', 'navy blue', 'chocolate brown',
                'deep teal', 'charcoal gray', 'deep brown', 'warm black'
            ],
            'light_spring': [
                'peach', 'light yellow', 'mint green', 'sky blue', 'light pink',
                'ivory', 'light beige', 'warm white', 'light gray'
            ]
        }
    
    def extract_colors_from_text(self, text: str) -> List[Dict[str, str]]:
        """Extract color names from text and return color objects."""
        colors = []
        text_lower = text.lower()
        
        # Look for color mentions in the text
        for color_name, hex_code in self.color_mapping.items():
            if color_name in text_lower:
                colors.append({
                    'name': color_name.title(),
                    'hex': hex_code,
                    'category': self._get_color_category(color_name)
                })
        
        # If no specific colors found, generate based on skin tone type
        if not colors:
            colors = self._generate_default_palette(text_lower)
        
        return colors[:8]  # Limit to 8 colors for display
    
    def _get_color_category(self, color_name: str) -> str:
        """Get the category of a color."""
        for category, colors in self.color_categories.items():
            if color_name in colors:
                return category
        return 'neutral'
    
    def _generate_default_palette(self, text: str) -> List[Dict[str, str]]:
        """Generate a default palette based on skin tone type mentioned in text."""
        if 'autumn' in text:
            if 'warm' in text:
                category = 'warm_autumn'
            elif 'deep' in text:
                category = 'deep_autumn'
            else:
                category = 'warm_autumn'
        elif 'winter' in text:
            category = 'cool_winter'
        elif 'summer' in text:
            category = 'soft_summer'
        elif 'spring' in text:
            if 'bright' in text:
                category = 'bright_spring'
            elif 'light' in text:
                category = 'light_spring'
            else:
                category = 'bright_spring'
        else:
            # Default to warm autumn if no specific type found
            category = 'warm_autumn'
        
        colors = []
        for color_name in self.color_categories.get(category, self.color_categories['warm_autumn']):
            colors.append({
                'name': color_name.title(),
                'hex': self.color_mapping[color_name],
                'category': category
            })
        
        return colors[:8]
    
    def create_palette_html(self, colors: List[Dict[str, str]]) -> str:
        """Create HTML for displaying the color palette."""
        if not colors:
            return '<p>No specific colors found in the analysis.</p>'
        
        html = '<div class="color-palette">'
        html += '<h5>Recommended Color Palette:</h5>'
        html += '<div class="color-swatches">'
        
        for color in colors:
            html += f'''
                <div class="color-swatch" title="{color['name']}">
                    <div class="color-preview" style="background-color: {color['hex']}"></div>
                    <div class="color-name">{color['name']}</div>
                </div>
            '''
        
        html += '</div></div>'
        return html
    
    def get_color_suggestions(self, skin_tone_type: str) -> List[Dict[str, str]]:
        """Get color suggestions based on skin tone type."""
        category = skin_tone_type.lower().replace(' ', '_')
        colors = self.color_categories.get(category, self.color_categories['warm_autumn'])
        
        return [
            {
                'name': color.title(),
                'hex': self.color_mapping[color],
                'category': category
            }
            for color in colors[:8]
        ]


# Global color palette instance
color_palette = ColorPalette()


def extract_and_format_colors(text: str) -> Tuple[str, str]:
    """
    Extract colors from text and return both the original text and color palette HTML.
    
    Returns:
        Tuple of (original_text, color_palette_html)
    """
    colors = color_palette.extract_colors_from_text(text)
    palette_html = color_palette.create_palette_html(colors)
    
    return text, palette_html


if __name__ == "__main__":
    # Test the color extraction
    test_text = """
    **Neutrals:** Camel, olive green, chocolate brown, warm gray, and ivory.
    **Colors:** Mustard yellow, burnt orange, rust, forest green, teal, and tomato red.
    """
    
    colors = color_palette.extract_colors_from_text(test_text)
    print("Extracted colors:", colors)
    
    palette_html = color_palette.create_palette_html(colors)
    print("Palette HTML:", palette_html) 