"""
Authentication service utilities
"""
import os
from passlib.hash import bcrypt
from ..models import User
from ..extensions import db

def seed_admin_user():
    """Seed admin user if not exists"""
    admin_email = os.getenv('ADMIN_EMAIL')
    admin_password = os.getenv('ADMIN_PASSWORD')
    
    if not admin_email or not admin_password:
        print("Warning: ADMIN_EMAIL or ADMIN_PASSWORD missing in env. Skipping admin seed.")
        return False
    
    existing_admin = User.query.filter_by(email=admin_email, role='admin').first()
    if not existing_admin:
        admin_user = User(
            first_name="Admin", 
            last_name="User",
            phone="0000000000",  # Required field
            email=admin_email, 
            password_hash=bcrypt.hash(admin_password), 
            role="admin", 
            status="active",
            is_phone_verified=True,
            is_email_verified=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"Admin seeded: {admin_user.email}")
        return True
    else:
        print(f"Admin user already exists: {existing_admin.email}")
        return False

def verify_password(password_hash, password):
    """Verify password against hash"""
    return bcrypt.verify(password, password_hash)

def hash_password(password):
    """Hash password"""
    return bcrypt.hash(password)
