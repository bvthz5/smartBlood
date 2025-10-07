#!/usr/bin/env python3
"""
SmartBlood Backend Server - Local Development
Run with: python run.py
"""

import os
from dotenv import load_dotenv
from app import create_app

if __name__ == "__main__":
    # Load environment variables from .env file
    load_dotenv()
    
    app = create_app()
    
    # Local development settings
    host = "127.0.0.1"  # localhost only
    port = 5000
    debug = True
    
    print(f"Starting SmartBlood backend on http://{host}:{port}")
    print("Database: PostgreSQL")
    print("Debug mode: True")
    
    app.run(host=host, port=port, debug=debug)
