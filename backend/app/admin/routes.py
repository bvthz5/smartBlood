"""
Admin Routes
"""
from flask import Blueprint, request, jsonify
from app.models import User, Request
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    """
    Get All Users
    ---
    tags:
      - Admin
    summary: Get list of all users
    description: Retrieve a list of all users in the system (admin only)
    security:
      - Bearer: []
    produces:
      - application/json
    parameters:
      - in: query
        name: role
        type: string
        description: Filter users by role (donor, hospital, admin)
        required: false
      - in: query
        name: page
        type: integer
        description: Page number for pagination
        required: false
        default: 1
      - in: query
        name: per_page
        type: integer
        description: Number of users per page
        required: false
        default: 50
    responses:
      200:
        description: Users retrieved successfully
        schema:
          type: object
          properties:
            users:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: John Doe
                  email:
                    type: string
                    example: john@example.com
                  phone:
                    type: string
                    example: +91-9876543210
                  role:
                    type: string
                    example: donor
                  is_active:
                    type: boolean
                    example: true
                  created_at:
                    type: string
                    format: date-time
            total:
              type: integer
              example: 150
            page:
              type: integer
              example: 1
            per_page:
              type: integer
              example: 50
      401:
        description: Unauthorized
        schema:
          type: object
          properties:
            error:
              type: string
              example: Unauthorized
    """
    try:
        # Verify admin user
        current_user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=current_user_id, role="admin").first()
        
        if not admin_user:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get query parameters
        role_filter = request.args.get('role')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query
        query = User.query
        
        if role_filter:
            query = query.filter_by(role=role_filter)
        
        # Get paginated results
        users_pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        users_data = []
        for user in users_pagination.items:
            users_data.append({
                "id": user.id,
                "name": f"{user.first_name} {user.last_name}".strip(),
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
        
        return jsonify({
            "users": users_data,
            "total": users_pagination.total,
            "page": page,
            "per_page": per_page
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch users"}), 500