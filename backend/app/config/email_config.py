"""
Email Configuration for SmartBlood Admin
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmailConfig:
    """Email configuration settings"""
    
    # SMTP Settings
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    
    # Sender Information
    SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'smartblooda@gmail.com')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', '')
    SENDER_NAME = os.getenv('SENDER_NAME', 'SmartBlood Admin')
    
    # Frontend URL for reset links
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # Email Templates
    RESET_SUBJECT = "Password Reset Request - SmartBlood Admin"
    OTP_SUBJECT = "Password Reset OTP - SmartBlood Admin"
    
    @classmethod
    def validate_config(cls):
        """Validate email configuration"""
        required_fields = [
            'SENDER_EMAIL',
            'SENDER_PASSWORD'
        ]
        
        missing_fields = []
        for field in required_fields:
            if not getattr(cls, field):
                missing_fields.append(field)
        
        if missing_fields:
            raise ValueError(f"Missing required email configuration: {', '.join(missing_fields)}")
        
        return True




