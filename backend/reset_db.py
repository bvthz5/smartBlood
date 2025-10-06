#!/usr/bin/env python3
"""
Database Reset Script for SmartBlood
Run with: python reset_db.py

This script drops all tables and recreates them with migrations.
Use with caution - this will delete all data!
"""

import os
import sys
from dotenv import load_dotenv
from flask_migrate import downgrade, upgrade, current
from app import create_app, db

def reset_database():
    """Reset database by dropping and recreating all tables"""
    # Load environment variables
    load_dotenv()
    
    # Check for required environment variables
    if not os.environ.get("DATABASE_URL"):
        print("❌ Error: DATABASE_URL environment variable is required")
        print("Please create a .env file with DATABASE_URL configured.")
        sys.exit(1)
    
    app = create_app()
    
    with app.app_context():
        try:
            print("⚠️  WARNING: This will delete all data in the database!")
            response = input("Are you sure you want to continue? (yes/no): ")
            
            if response.lower() != 'yes':
                print("❌ Operation cancelled.")
                sys.exit(0)
            
            print("🔄 Resetting database...")
            
            # Drop all tables
            print("🗑️  Dropping all tables...")
            db.drop_all()
            
            # Recreate all tables using migrations
            print("🔄 Running migrations...")
            upgrade()
            
            print("✅ Database reset completed successfully!")
            
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Database tables: {', '.join(tables)}")
            
        except Exception as e:
            print(f"❌ Database reset error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    reset_database()
