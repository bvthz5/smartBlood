"""
Health check API endpoints
"""
from flask import Blueprint, jsonify
from ..services.database import check_database_connection
import os

health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health')
def health():
    """
    System Health Check
    ---
    tags:
      - Health
    summary: Check system health and database connectivity
    description: Returns the current health status of the SmartBlood API including database connectivity
    produces:
      - application/json
    responses:
      200:
        description: Health status retrieved successfully
        schema:
          type: object
          properties:
            status:
              type: string
              enum: [ok, degraded]
              example: ok
              description: Overall system health status
            db_connected:
              type: boolean
              example: true
              description: Database connection status
            env:
              type: string
              example: development
              description: Current environment (development/production)
    """
    db_connected = check_database_connection()
    status = "ok" if db_connected else "degraded"
    
    return jsonify({
        "status": status,
        "db_connected": db_connected,
        "env": os.getenv('FLASK_ENV', 'dev')
    })
