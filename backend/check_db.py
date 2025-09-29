#!/usr/bin/env python3
"""
Database Connection Check Utility
Run with: python check_db.py

This script tests the database connection using the DATABASE_URL from .env
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

def check_database_connection():
    """Check database connectivity and return status"""
    print("Checking database connection...")
    
    # Load environment variables
    load_dotenv()
    
    # Get database URL
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL not found in environment variables")
        print("Please ensure you have a .env file with DATABASE_URL configured")
        return False
    
    # Mask password in URL for logging
    masked_url = database_url
    try:
        prefix, rest = database_url.split("://", 1)
        cred, host = rest.split("@", 1)
        user, pwd = cred.split(":", 1)
        masked_url = f"{prefix}://{user}:*****@{host}"
    except Exception:
        masked_url = database_url
    print(f"Using DATABASE_URL: {masked_url}")
    
    try:
        # Create engine with timeout
        engine = create_engine(
            database_url,
            pool_timeout=10,
            pool_recycle=3600
        )
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            if row and row[0] == 1:
                print("SUCCESS: Database connection test passed")
                
                # Get database version
                try:
                    version_result = conn.execute(text("SELECT version()"))
                    version = version_result.fetchone()[0]
                    print(f"Database version: {version.split(',')[0]}")
                except Exception as e:
                    print(f"Could not get database version: {e}")
                
                return True
            else:
                print("ERROR: Database connection test failed - unexpected result")
                return False
                
    except Exception as e:
        print(f"ERROR: Database connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check if the database 'smartblood' exists")
        print("3. Verify credentials in your .env file")
        print("4. Check if the host and port are correct")
        return False

if __name__ == "__main__":
    success = check_database_connection()
    sys.exit(0 if success else 1)
