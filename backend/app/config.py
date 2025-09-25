import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", f"sqlite:///{os.path.join(basedir, '..', 'data', 'dev.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET", "jwt-change-me")
    OTP_SECRET = os.environ.get("OTP_SECRET", "otp-secret")
    ACCESS_EXPIRES_MINUTES = int(os.environ.get("ACCESS_EXPIRES_MINUTES", 15))
    REFRESH_EXPIRES_DAYS = int(os.environ.get("REFRESH_EXPIRES_DAYS", 14))
