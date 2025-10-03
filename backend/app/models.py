from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True, nullable=True)  # optional
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, donor, staff
    status = db.Column(db.String(20), default="inactive")  # active, inactive, blocked, deleted
    is_phone_verified = db.Column(db.Boolean, default=False)
    is_email_verified = db.Column(db.Boolean, default=False)
    profile_pic_url = db.Column(db.Text, nullable=True)  # path/key in S3
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(50), default="Kerala")
    pincode = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    donor = db.relationship("Donor", uselist=False, back_populates="user")
    staff = db.relationship("HospitalStaff", uselist=False, back_populates="user", foreign_keys="[HospitalStaff.user_id]")


class Donor(db.Model):
    __tablename__ = "donors"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    blood_group = db.Column(db.String(5), nullable=False)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    availability = db.Column(db.Boolean, default=True)
    last_donation_date = db.Column(db.Date)
    reliability_score = db.Column(db.Float, default=0)
    location_lat = db.Column(db.Numeric(9,6))
    location_lng = db.Column(db.Numeric(9,6))

    user = db.relationship("User", back_populates="donor")
    matches = db.relationship("Match", back_populates="donor")


class Hospital(db.Model):
    __tablename__ = "hospitals"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(50), default="Kerala")
    pincode = db.Column(db.String(10))
    latitude = db.Column(db.Numeric(9,6))
    longitude = db.Column(db.Numeric(9,6))
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))  # admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    staff = db.relationship("HospitalStaff", back_populates="hospital")
    requests = db.relationship("Request", back_populates="hospital")


class HospitalStaff(db.Model):
    __tablename__ = "hospital_staff"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey("hospitals.id", ondelete="CASCADE"))
    invited_by = db.Column(db.Integer, db.ForeignKey("users.id"))  # admin
    status = db.Column(db.String(20), default="pending")  # pending, active, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="staff", foreign_keys=[user_id])
    hospital = db.relationship("Hospital", back_populates="staff")


class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey("hospitals.id", ondelete="CASCADE"))
    created_by = db.Column(db.Integer, db.ForeignKey("hospital_staff.id"))
    blood_group = db.Column(db.String(5), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    urgency = db.Column(db.String(20), nullable=False)  # emergency, urgent, scheduled
    status = db.Column(db.String(20), default="pending")  # pending, active, matched, completed, cancelled
    location_lat = db.Column(db.Numeric(9,6))
    location_lng = db.Column(db.Numeric(9,6))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    hospital = db.relationship("Hospital", back_populates="requests")
    matches = db.relationship("Match", back_populates="request")


class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id", ondelete="CASCADE"))
    donor_id = db.Column(db.Integer, db.ForeignKey("donors.user_id", ondelete="CASCADE"))
    match_score = db.Column(db.Float)
    status = db.Column(db.String(20), default="notified")  # notified, accepted, declined, expired
    notified_at = db.Column(db.DateTime)
    responded_at = db.Column(db.DateTime)

    request = db.relationship("Request", back_populates="matches")
    donor = db.relationship("Donor", back_populates="matches")


class DonationHistory(db.Model):
    __tablename__ = "donation_history"

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey("donors.user_id"))
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id"))
    hospital_id = db.Column(db.Integer, db.ForeignKey("hospitals.id"))
    units = db.Column(db.Integer, nullable=False)
    donation_date = db.Column(db.DateTime, default=datetime.utcnow)


class OTPSession(db.Model):
    __tablename__ = "otp_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    channel = db.Column(db.String(10), nullable=False)  # phone, email
    destination = db.Column(db.String(150), nullable=False)
    otp_hash = db.Column(db.Text, nullable=False)  # store hashed OTP
    attempts_left = db.Column(db.Integer, default=3)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
