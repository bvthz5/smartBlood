import hmac
import hashlib
from flask import current_app
from passlib.hash import bcrypt

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
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str):
    return bcrypt.verify(password, hashed)
