#!/usr/bin/env python3
"""
SmartBlood Backend Server
Run with: python run.py

Make sure you have a .env file with DATABASE_URL configured.
Copy env.template to .env and update the values.
"""

import os
from dotenv import load_dotenv
from app import create_app

if __name__ == "__main__":
    # Load environment variables from .env file
    load_dotenv()
    
    # Check for required environment variables
    if not os.environ.get("DATABASE_URL"):
        print(" Error: DATABASE_URL environment variable is required")
        print("Please create a .env file with DATABASE_URL configured.")
        print("Copy env.template to .env and update the values.")
        exit(1)
    
    app = create_app()
    
    # Get host and port from environment or use defaults
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    
    print(f" Starting SmartBlood backend on {host}:{port}")
    print(f"Database: PostgreSQL (smartblood)")
    print(f"Debug mode: {debug}")
    
    app.run(host=host, port=port, debug=debug)
