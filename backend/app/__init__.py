import os
import sys
from flask import Flask, jsonify
from .config import config
from .extensions import db, migrate, jwt
from .services.database import check_database_connection
from .services.auth import seed_admin_user

def register_blueprints(app):
    """Register all blueprints"""
    from .auth.routes import auth_bp
    from .donor.routes import donor_bp
    from .admin.routes import admin_bp
    from .requests.routes import req_bp
    from .admin.match_routes import admin_match_bp
    from .api.health import health_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(donor_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(req_bp)
    app.register_blueprint(admin_match_bp)
    app.register_blueprint(health_bp)

def initialize_database(app):
    """Initialize database and seed admin user"""
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("Database tables created successfully")
            
            # Seed admin user
            seed_admin_user()
                
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__, static_folder=None)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    register_blueprints(app)

    # Check database connection at startup
    with app.app_context():
        if not check_database_connection():
            print("Failed to connect to database. Please check your DATABASE_URL and ensure PostgreSQL is running.")
            sys.exit(1)

    # Initialize database
    initialize_database(app)

    # Register main routes
    @app.route("/")
    def index():
        return {"status":"ok","service":"SmartBlood backend"}

    return app