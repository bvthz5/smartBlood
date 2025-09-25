from datetime import datetime, timedelta
from .extensions import db
from sqlalchemy import func

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(255), unique=True, nullable=True)
    phone = db.Column(db.String(50), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="donor")  # donor / seeker / admin
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    donor_profile = db.relationship("Donor", uselist=False, back_populates="user")

class Donor(db.Model):
    __tablename__ = "donors"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    blood_group = db.Column(db.String(5))
    last_donation_date = db.Column(db.Date)
    availability_status = db.Column(db.String(20), default="unavailable")
    reliability_score = db.Column(db.Float, default=0.0)
    location_lat = db.Column(db.Float)
    location_lon = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="donor_profile")

class OTPSession(db.Model):
    __tablename__ = "otp_sessions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    code_hash = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50))  # phone_verification or password_reset
    expires_at = db.Column(db.DateTime)
    attempts = db.Column(db.Integer, default=0)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    revoked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)

class Request(db.Model):
    __tablename__ = "requests"
    id = db.Column(db.Integer, primary_key=True)
    seeker_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    blood_group = db.Column(db.String(5))
    units_required = db.Column(db.Integer, default=1)
    urgency = db.Column(db.String(20), default="normal")
    location = db.Column(db.String(255))
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MatchRecord(db.Model):
    __tablename__ = "match_records"
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id"), nullable=False)
    donor_id = db.Column(db.Integer, db.ForeignKey("donors.id"), nullable=False)
    score = db.Column(db.Float, default=0.0)
    rank = db.Column(db.Integer)
    response = db.Column(db.String(20))  # accepted/rejected/pending
    response_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DonationHistory(db.Model):
    __tablename__ = "donation_history"
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey("donors.id"), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id"), nullable=True)
    donated_at = db.Column(db.DateTime, default=datetime.utcnow)
    units = db.Column(db.Integer, default=1)

class AdminAuditLog(db.Model):
    __tablename__ = "admin_audit_logs"
    id = db.Column(db.Integer, primary_key=True)
    admin_user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    action = db.Column(db.String(255))
    target = db.Column(db.String(255))
    details = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
