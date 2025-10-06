"""
Admin Authentication Routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db
from app.services.auth import verify_password
from datetime import timedelta

admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/admin/auth")

@admin_auth_bp.route("/login", methods=["POST"])
def admin_login():
    """
    Admin Login
    ---
    tags:
      - Admin
    summary: Authenticate admin user
    description: Login endpoint for admin users to access the admin dashboard
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: credentials
        description: Admin login credentials
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
              example: admin@smartblood.com
              description: Admin email address
            password:
              type: string
              format: password
              example: Admin@123
              description: Admin password
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            message:
              type: string
              example: Login successful
            admin:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                name:
                  type: string
                  example: Admin User
                email:
                  type: string
                  example: admin@smartblood.com
                role:
                  type: string
                  example: admin
            access_token:
              type: string
              example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
              description: JWT access token for authenticated requests
            token_type:
              type: string
              example: bearer
      401:
        description: Invalid credentials
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid email or password
      400:
        description: Missing required fields
        schema:
          type: object
          properties:
            error:
              type: string
              example: Email and password are required
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is required"}), 400
            
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find admin user
        admin_user = User.query.filter_by(email=email, role="admin").first()
        
        if not admin_user:
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Verify password
        if not verify_password(admin_user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Check if user is active
        if admin_user.status != "active":
            return jsonify({"error": "Account is deactivated"}), 401
        
        # Create JWT token
        access_token = create_access_token(
            identity=str(admin_user.id),
            expires_delta=timedelta(hours=24),
            additional_claims={"role": "admin"}
        )
        
        # Update last login
        admin_user.last_login = db.func.now()
        db.session.commit()
        
        return jsonify({
            "message": "Login successful",
            "admin": {
                "id": admin_user.id,
                "name": f"{admin_user.first_name} {admin_user.last_name}".strip(),
                "email": admin_user.email,
                "role": admin_user.role
            },
            "access_token": access_token,
            "token_type": "bearer"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@admin_auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def admin_logout():
    """
    Admin Logout
    ---
    tags:
      - Admin
    summary: Logout admin user
    description: Logout endpoint for admin users (token will be invalidated on client side)
    security:
      - Bearer: []
    produces:
      - application/json
    responses:
      200:
        description: Logout successful
        schema:
          type: object
          properties:
            message:
              type: string
              example: Logout successful
      401:
        description: Unauthorized - Invalid or missing JWT token
        schema:
          type: object
          properties:
            error:
              type: string
              example: Unauthorized
    """
    try:
        current_user_id = get_jwt_identity()
        
        # In a real application, you might want to blacklist the token
        # For now, we'll just return a success message
        # The client should remove the token from storage
        
        return jsonify({
            "message": "Logout successful"
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@admin_auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_admin_profile():
    """
    Get Admin Profile
    ---
    tags:
      - Admin
    summary: Get current admin user profile
    description: Retrieve the profile information of the currently authenticated admin user
    security:
      - Bearer: []
    produces:
      - application/json
    responses:
      200:
        description: Admin profile retrieved successfully
        schema:
          type: object
          properties:
            admin:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                name:
                  type: string
                  example: Admin User
                email:
                  type: string
                  example: admin@smartblood.com
                role:
                  type: string
                  example: admin
                phone:
                  type: string
                  example: +91-9876543210
                created_at:
                  type: string
                  format: date-time
                  example: "2024-01-01T00:00:00Z"
                last_login:
                  type: string
                  format: date-time
                  example: "2024-01-01T12:00:00Z"
      401:
        description: Unauthorized - Invalid or missing JWT token
        schema:
          type: object
          properties:
            error:
              type: string
              example: Unauthorized
      404:
        description: Admin user not found
        schema:
          type: object
          properties:
            error:
              type: string
              example: Admin user not found
    """
    try:
        current_user_id = get_jwt_identity()
        
        admin_user = User.query.filter_by(id=current_user_id, role="admin").first()
        
        if not admin_user:
            return jsonify({"error": "Admin user not found"}), 404
        
        return jsonify({
            "admin": {
                "id": admin_user.id,
                "name": f"{admin_user.first_name} {admin_user.last_name}".strip(),
                "email": admin_user.email,
                "role": admin_user.role,
                "phone": admin_user.phone,
                "created_at": admin_user.created_at.isoformat() if admin_user.created_at else None,
                "last_login": admin_user.last_login.isoformat() if admin_user.last_login else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
