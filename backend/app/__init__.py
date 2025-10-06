import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flasgger import Swagger
from .config import config
from .extensions import db, migrate, jwt
from .services.database import check_database_connection
from .services.auth import seed_admin_user

def configure_cors(app):
    """Configure CORS for cross-origin requests"""
    CORS(app, 
         origins=[
             "http://localhost:3000",  # React development server
             "http://127.0.0.1:3000",  # Alternative localhost
             "http://localhost:5173",  # Vite development server
             "http://127.0.0.1:5173",  # Alternative Vite localhost
         ],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         supports_credentials=True)

def configure_swagger(app):
    """Configure Swagger UI for API documentation"""
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs"
    }
    
    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "SmartBlood API",
            "version": "1.0.0",
            "description": "API documentation for SmartBlood blood donation platform. Connect donors with those in need of blood transfusions across Kerala.",
            "contact": {
                "name": "SmartBlood Team",
                "email": "support@smartblood.com"
            }
        },
        "host": "localhost:5000",
        "basePath": "/",
        "schemes": ["http", "https"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ],
        "tags": [
            {
                "name": "Authentication",
                "description": "User authentication and authorization"
            },
            {
                "name": "Admin",
                "description": "Administrative operations and dashboard"
            },
            {
                "name": "Donor",
                "description": "Blood donor management and operations"
            },
            {
                "name": "Requests",
                "description": "Blood request management"
            },
            {
                "name": "Health",
                "description": "System health and status checks"
            }
        ]
    }
    
    Swagger(app, config=swagger_config, template=swagger_template)

def register_blueprints(app):
    """Register all blueprints"""
    from .auth.routes import auth_bp
    from .donor.routes import donor_bp
    from .admin.routes import admin_bp
    from .admin.login import admin_auth_bp
    from .admin.dashboard import admin_dashboard_bp
    from .requests.routes import req_bp
    from .admin.match_routes import admin_match_bp
    from .api.health import health_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(donor_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(admin_auth_bp)
    app.register_blueprint(admin_dashboard_bp)
    app.register_blueprint(req_bp)
    app.register_blueprint(admin_match_bp)
    app.register_blueprint(health_bp)

def initialize_database(app):
    """Initialize database and seed admin user"""
    with app.app_context():
        try:
            # Run database migrations
            from flask_migrate import upgrade
            print("Running database migrations...")
            upgrade()
            print("Database migrations completed successfully")
            
            # Seed admin user
            seed_admin_user()
                
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise

def create_app(config_name='default'):
    """Application factory pattern"""
    # Load environment variables from .env file
    load_dotenv()
    
    app = Flask(__name__, static_folder=None)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Configure CORS
    configure_cors(app)

    # Configure Swagger UI
    configure_swagger(app)

    # Register blueprints
    register_blueprints(app)

    # Check database connection at startup
    with app.app_context():
        if not check_database_connection():
            print("Failed to connect to database. Please check your DATABASE_URL and ensure PostgreSQL is running.")
            sys.exit(1)

    # Database initialization is handled by migrate_db.py script
    # initialize_database(app)

    # Register main routes
    @app.route("/")
    def index():
        return {"status":"ok","service":"SmartBlood backend"}

    return app