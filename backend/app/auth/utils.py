import hmac
import hashlib
from flask import current_app
from passlib.hash import bcrypt
from werkzeug.security import generate_password_hash, check_password_hash

def generate_otp(length=6):
    import random
    start = 10**(length-1)
    return str(random.randint(start, start*10 - 1))

def otp_hash(otp: str):
    # HMAC-based deterministic hash using OTP_SECRET
    key = current_app.config.get("OTP_SECRET", "otp-secret")
    return hmac.new(key.encode(), otp.encode(), hashlib.sha256).hexdigest()

def verify_otp(otp: str, hashed: str):
    return hmac.compare_digest(otp_hash(otp), hashed)

def hash_password(password: str):
    """Hash password using werkzeug for compatibility with existing system"""
    return generate_password_hash(password)

def verify_password(password: str, hashed: str):
    """Verify password against werkzeug hashes (scrypt/pbkdf2) and bcrypt for backward compatibility"""
    try:
        # Try werkzeug first (scrypt/pbkdf2 - used by admin and existing users)
        return check_password_hash(hashed, password)
    except Exception:
        try:
            # Try bcrypt (new format)
            return bcrypt.verify(password, hashed)
        except Exception:
            # If both fail, return False
            return False
