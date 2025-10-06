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
        # Truncate password if it's too long for bcrypt (72 bytes max)
        if len(admin_password.encode('utf-8')) > 72:
            admin_password = admin_password[:72]
            print("Warning: Admin password truncated to 72 bytes for bcrypt compatibility")
        
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
    # Check if it's a bcrypt hash (starts with $2b$)
    if password_hash.startswith('$2b$'):
        # Truncate password if it's too long for bcrypt (72 bytes max)
        if len(password.encode('utf-8')) > 72:
            password = password[:72]
        return bcrypt.verify(password, password_hash)
    else:
        # Simple hash verification (for temporary admin user)
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest() == password_hash

def hash_password(password):
    """Hash password"""
    # Truncate password if it's too long for bcrypt (72 bytes max)
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return bcrypt.hash(password)
