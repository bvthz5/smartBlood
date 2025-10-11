"""
ID Encoding utilities for SmartBlood Connect.

Provides Base64 URL-safe encoding/decoding for obfuscating sequential IDs
in public-facing URLs and API requests.
"""

import base64
import binascii
from typing import Union


class IDEncodingError(Exception):
    """Custom exception for ID encoding/decoding errors."""
    pass


def encode_id(integer_id: int) -> str:
    """
    Encode an integer ID to Base64 URL-safe string.
    
    Args:
        integer_id: The integer ID to encode
        
    Returns:
        Base64 URL-safe encoded string
        
    Raises:
        IDEncodingError: If encoding fails
    """
    try:
        # Convert integer to bytes
        id_bytes = str(integer_id).encode('utf-8')
        # Encode to Base64 and make URL-safe
        encoded = base64.urlsafe_b64encode(id_bytes).decode('ascii')
        # Remove padding
        return encoded.rstrip('=')
    except Exception as e:
        raise IDEncodingError(f"Failed to encode ID {integer_id}: {str(e)}")


def decode_id(base64_string: str) -> int:
    """
    Decode a Base64 URL-safe string to integer ID.
    
    Args:
        base64_string: The Base64 URL-safe encoded string
        
    Returns:
        The decoded integer ID
        
    Raises:
        IDEncodingError: If decoding fails or result is not a valid integer
    """
    try:
        # Add padding if needed
        padding_needed = len(base64_string) % 4
        if padding_needed:
            base64_string += '=' * (4 - padding_needed)
        
        # Decode Base64
        decoded_bytes = base64.urlsafe_b64decode(base64_string.encode('ascii'))
        # Convert to string then integer
        decoded_str = decoded_bytes.decode('utf-8')
        return int(decoded_str)
        
    except (binascii.Error, UnicodeDecodeError, ValueError) as e:
        raise IDEncodingError(f"Failed to decode ID '{base64_string}': {str(e)}")
    except Exception as e:
        raise IDEncodingError(f"Unexpected error decoding ID '{base64_string}': {str(e)}")
