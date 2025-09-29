"""
Health check API endpoints
"""
from flask import Blueprint, jsonify
from ..services.database import check_database_connection
import os

health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health')
def health():
    """Health check endpoint with database status"""
    db_connected = check_database_connection()
    status = "ok" if db_connected else "degraded"
    
    return jsonify({
        "status": status,
        "db_connected": db_connected,
        "env": os.getenv('FLASK_ENV', 'dev')
    })
