"""
Authentication service utilities
"""
import os
import hashlib
from passlib.hash import bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import User
from ..extensions import db

def seed_admin_user():
    """Seed admin user if not exists"""
    admin_email = os.getenv('ADMIN_EMAIL')
    admin_password = os.getenv('ADMIN_PASSWORD')
    
    if not admin_email or not admin_password:
        print("Warning: Admin credentials missing in environment. Skipping admin seed.")
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
            password_hash=hash_password(admin_password), 
            role="admin", 
            status="active",
            is_phone_verified=True,
            is_email_verified=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created successfully")
        return True
    else:
        print("Admin user already exists")
        return False

def verify_password(password_hash, password):
    """Verify password against hash - prioritizes werkzeug for compatibility"""
    try:
        # Check if it's a werkzeug hash (starts with pbkdf2: or scrypt:)
        if password_hash.startswith(('pbkdf2:', 'scrypt:')):
            return check_password_hash(password_hash, password)
        # Check if it's a bcrypt hash (starts with $2b$)
        elif password_hash.startswith('$2b$'):
            # Truncate password if it's too long for bcrypt (72 bytes max)
            if len(password.encode('utf-8')) > 72:
                password = password[:72]
            return bcrypt.verify(password, password_hash)
        else:
            # Legacy SHA256 hash verification
            print("Warning: Using legacy SHA256 password hash. Consider migrating to werkzeug.")
            return hashlib.sha256(password.encode()).hexdigest() == password_hash
    except Exception as e:
        print(f"Password verification error: {str(e)}")
        # Fallback to SHA256 hash verification for legacy compatibility
        return hashlib.sha256(password.encode()).hexdigest() == password_hash

def hash_password(password):
    """Hash password using werkzeug for compatibility"""
    # Use werkzeug's secure password hashing
    return generate_password_hash(password)
