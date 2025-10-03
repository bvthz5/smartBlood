import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")
    
    # Database configuration - PostgreSQL only
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL not set. Please create backend/.env or set env var.")
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-change-me")
    OTP_SECRET = os.environ.get("OTP_SECRET", "otp-secret")
    ACCESS_EXPIRES_MINUTES = int(os.environ.get("ACCESS_EXPIRES_MINUTES", 15))
    REFRESH_EXPIRES_DAYS = int(os.environ.get("REFRESH_EXPIRES_DAYS", 14))
    
    # Admin seeding configuration
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@smartblood.test")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin@123")

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("TEST_DATABASE_URL", "postgresql+psycopg2://postgres:123@localhost:5432/smartblood_test")

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
