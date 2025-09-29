"""
Database service utilities
"""
import os
from sqlalchemy import create_engine, text
from flask import current_app

def check_database_connection():
    """Check database connectivity with timeout"""
    try:
        # Mask password in URL for logging
        db_url = current_app.config['SQLALCHEMY_DATABASE_URI']
        masked_url = db_url
        try:
            prefix, rest = db_url.split("://", 1)
            cred, host = rest.split("@", 1)
            user, pwd = cred.split(":", 1)
            masked_url = f"{prefix}://{user}:*****@{host}"
        except Exception:
            masked_url = db_url
        
        print(f"Connecting to database: {masked_url}")
        
        engine = create_engine(
            db_url,
            pool_timeout=5,
            pool_recycle=3600
        )
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        print("Database connection successful")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def get_database_info():
    """Get database information"""
    try:
        engine = create_engine(current_app.config['SQLALCHEMY_DATABASE_URI'])
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            return {
                'connected': True,
                'version': version.split(',')[0] if version else 'Unknown'
            }
    except Exception as e:
        return {
            'connected': False,
            'error': str(e)
        }
