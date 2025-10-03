from flask import Blueprint, request, jsonify
from app.models import User, Request
from app.extensions import db
from passlib.hash import bcrypt

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/auth/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email, role="admin").first()
    if not user:
        return jsonify({"error":"invalid"}), 401
    if not bcrypt.verify(password, user.password_hash):
        return jsonify({"error":"invalid"}), 401
    # simple success
    return jsonify({"message":"admin ok", "admin_id": user.id})

@admin_bp.route("/users", methods=["GET"])
def users_list():
    users = User.query.all()
    out = [{"id":u.id,"name":u.name,"email":u.email,"phone":u.phone,"role":u.role,"active":u.is_active} for u in users]
    return jsonify(out)

@admin_bp.route("/users/<int:user_id>/block", methods=["PUT"])
def block_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error":"not found"}), 404
    user.status = "blocked"
    # TODO: Implement audit logging with new schema
    print(f"Admin action: block_user for user {user_id}")
    db.session.commit()
    return jsonify({"message":"user blocked"})
