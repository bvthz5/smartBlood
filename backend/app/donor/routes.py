from flask import Blueprint, jsonify, request, current_app
from app.extensions import db
from app.models import User, Donor, Match, DonationHistory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

donor_bp = Blueprint("donor", __name__, url_prefix="/api/donors")


@donor_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    donor = Donor.query.filter_by(user_id=uid).first()
    return jsonify({
        "id": user.id,
        "name": f"{user.first_name} {user.last_name or ''}".strip(),
        "email": user.email,
        "phone": user.phone,
        "blood_group": donor.blood_group if donor else None,
        "availability_status": donor.availability if donor else None,
        "last_donation_date": donor.last_donation_date.isoformat() if donor and donor.last_donation_date else None
    })

@donor_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    user = User.query.get(uid)
    donor = Donor.query.filter_by(user_id=uid).first()
    user.first_name = data.get("name", user.first_name)
    donor.blood_group = data.get("blood_group", donor.blood_group)
    donor.location_lat = data.get("location_lat", donor.location_lat)
    donor.location_lng = data.get("location_lon", donor.location_lng)
    db.session.commit()
    return jsonify({"message":"profile updated"})

@donor_bp.route("/availability", methods=["POST"])
@jwt_required()
def set_availability():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    status = data.get("status")
    donor = Donor.query.filter_by(user_id=uid).first()
    donor.availability = status.lower() == "available"
    db.session.commit()
    return jsonify({"status": "available" if donor.availability else "unavailable"})

@donor_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    uid = get_jwt_identity()
    donor = Donor.query.filter_by(user_id=uid).first()
    active_matches = Match.query.filter_by(donor_id=donor.id, status="notified").count()
    return jsonify({
        "availability_status": "available" if donor.availability else "unavailable",
        "reliability_score": donor.reliability_score,
        "last_donation_date": donor.last_donation_date.isoformat() if donor.last_donation_date else None,
        "active_matches_count": active_matches
    })

@donor_bp.route("/matches", methods=["GET"])
@jwt_required()
def list_matches():
    uid = get_jwt_identity()
    donor = Donor.query.filter_by(user_id=uid).first()
    if not donor:
        return jsonify({"error": "donor profile not found"}), 404
    # list pending or recent matches
    q = Match.query.filter_by(donor_id=donor.id).order_by(Match.notified_at.desc()).limit(50)
    rows = []
    for m in q:
        rows.append({
            "match_id": m.id,
            "request_id": m.request_id,
            "score": m.match_score,
            "response": m.status,
            "response_at": m.responded_at.isoformat() if m.responded_at else None,
            "notified_at": m.notified_at.isoformat() if m.notified_at else None
        })
    return jsonify(rows)

@donor_bp.route("/respond", methods=["POST"])
@jwt_required()
def respond_to_match():
    """
    Body: { match_id, action }  action = "accept" or "reject"
    Atomic: update match record, set response and response_at.
    If accepted -> optionally set request.status = 'matched' (first accepted)
    """
    uid = get_jwt_identity()
    donor = Donor.query.filter_by(user_id=uid).first()
    if not donor:
        return jsonify({"error": "donor profile not found"}), 404

    data = request.get_json() or {}
    match_id = data.get("match_id")
    action = (data.get("action") or "").lower()
    if action not in ("accept", "reject"):
        return jsonify({"error":"invalid action"}), 400

    mr = Match.query.with_for_update().filter_by(id=match_id, donor_id=donor.id).first()
    if not mr:
        return jsonify({"error":"match not found"}), 404
    if mr.status != "notified":
        return jsonify({"error":"already responded"}), 409

    try:
        # atomic update
        mr.status = "accepted" if action == "accept" else "declined"
        mr.responded_at = datetime.utcnow()
        db.session.add(mr)

        if action == "accept":
            # set request status to 'matched' if not already
            req = mr.request
            if req.status != "fulfilled" and req.status != "matched":
                req.status = "matched"
                db.session.add(req)
            # optional: create donation_history placeholder
            dh = DonationHistory(donor_id=donor.id, request_id=req.id, donated_at=None, units=0)
            db.session.add(dh)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("error responding to match")
        return jsonify({"error":"internal"}), 500

    return jsonify({"match_id": mr.id, "response": mr.status}), 200