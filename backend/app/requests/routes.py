# backend/app/requests/routes.py
from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models import Request, User, Donor
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

req_bp = Blueprint("requests", __name__, url_prefix="/api/requests")

@req_bp.route("", methods=["POST"])
@jwt_required(optional=False)
def create_request():
    """
    Seeker creates a blood request.
    Body: { blood_group, units_required, urgency, location }
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "seeker":
        return jsonify({"error": "only seekers can create requests"}), 403

    data = request.get_json() or {}
    blood_group = data.get("blood_group")
    units = int(data.get("units_required", 1))
    urgency = data.get("urgency", "normal")
    location = data.get("location")

    r = Request(seeker_id=user_id, blood_group=blood_group, units_required=units,
                urgency=urgency, location=location, status="pending", created_at=datetime.utcnow())
    db.session.add(r)
    db.session.commit()
    return jsonify({"request_id": r.id, "status": r.status}), 201

@req_bp.route("", methods=["GET"])
@jwt_required()
def list_requests():
    """
    List requests (for admin or for the seeker who created them)
    Query params: mine=true to list only own
    """
    uid = get_jwt_identity()
    mine = request.args.get("mine", "false").lower() == "true"
    q = Request.query
    if mine:
        q = q.filter_by(seeker_id=uid)
    results = []
    for r in q.order_by(Request.created_at.desc()).limit(50).all():
        results.append({
            "id": r.id, "seeker_id": r.seeker_id, "blood_group": r.blood_group,
            "units_required": r.units_required, "urgency": r.urgency, "status": r.status,
            "created_at": r.created_at.isoformat()
        })
    return jsonify(results)
