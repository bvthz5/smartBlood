"""
Simple Admin Dashboard Routes
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db

admin_dashboard_bp = Blueprint("admin_dashboard", __name__, url_prefix="/admin/dashboard")

@admin_dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard_data():
    """
    Simple Admin Dashboard Data
    ---
    tags:
      - Admin
    summary: Get basic dashboard statistics
    description: Retrieve basic dashboard data for the admin panel
    security:
      - Bearer: []
    produces:
      - application/json
    responses:
      200:
        description: Dashboard data retrieved successfully
        schema:
          type: object
          properties:
            stats:
              type: object
              properties:
                totalDonors:
                  type: integer
                  example: 12458
                activeDonors:
                  type: integer
                  example: 8732
                totalHospitals:
                  type: integer
                  example: 25
                openRequests:
                  type: integer
                  example: 45
                urgentRequests:
                  type: integer
                  example: 12
                donationsToday:
                  type: integer
                  example: 15
            charts:
              type: object
              properties:
                requestsOverTime:
                  type: array
                  items:
                    type: object
                    properties:
                      date:
                        type: string
                        example: "2024-01-01"
                      count:
                        type: integer
                        example: 5
                bloodGroupDistribution:
                  type: array
                  items:
                    type: object
                    properties:
                      group:
                        type: string
                        example: "A+"
                      count:
                        type: integer
                        example: 150
                requestsByDistrict:
                  type: array
                  items:
                    type: object
                    properties:
                      district:
                        type: string
                        example: "Ernakulam"
                      count:
                        type: integer
                        example: 25
            recentEmergencies:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  hospital:
                    type: string
                    example: "General Hospital"
                  bloodGroup:
                    type: string
                    example: "O+"
                  time:
                    type: string
                    example: "2 hours ago"
            topHospitals:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: "General Hospital"
                  location:
                    type: string
                    example: "Ernakulam"
                  requests:
                    type: integer
                    example: 45
            topDonors:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: "John Doe"
                  bloodGroup:
                    type: string
                    example: "O+"
                  donations:
                    type: integer
                    example: 5
      401:
        description: Unauthorized
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Unauthorized"
      500:
        description: Internal server error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Failed to fetch dashboard data"
    """
    try:
        # Verify admin user
        current_user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=current_user_id, role="admin").first()
        
        if not admin_user:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get basic statistics
        total_donors = User.query.filter_by(role="donor").count()
        active_donors = User.query.filter_by(role="donor", status="active").count()
        total_hospitals = User.query.filter_by(role="hospital").count()
        
        # Return mock data for now
        dashboard_data = {
            "stats": {
                "totalDonors": total_donors,
                "activeDonors": active_donors,
                "hospitals": total_hospitals,
                "openRequests": 45,
                "urgentRequests": 12,
                "donationsToday": 15
            },
            "charts": {
                "requestsOverTime": [
                    {"date": "2024-01-01", "count": 5},
                    {"date": "2024-01-02", "count": 8},
                    {"date": "2024-01-03", "count": 12},
                    {"date": "2024-01-04", "count": 7},
                    {"date": "2024-01-05", "count": 15},
                    {"date": "2024-01-06", "count": 9},
                    {"date": "2024-01-07", "count": 11}
                ],
                "bloodGroupDistribution": [
                    {"group": "A+", "count": 150},
                    {"group": "A-", "count": 45},
                    {"group": "B+", "count": 120},
                    {"group": "B-", "count": 35},
                    {"group": "AB+", "count": 25},
                    {"group": "AB-", "count": 8},
                    {"group": "O+", "count": 200},
                    {"group": "O-", "count": 60}
                ],
                "requestsByDistrict": [
                    {"district": "Ernakulam", "count": 25},
                    {"district": "Thiruvananthapuram", "count": 20},
                    {"district": "Kozhikode", "count": 15},
                    {"district": "Thrissur", "count": 12},
                    {"district": "Kollam", "count": 10}
                ]
            },
            "recentEmergencies": [
                {
                    "id": 1,
                    "hospital": "General Hospital",
                    "bloodGroup": "O+",
                    "time": "2 hours ago"
                },
                {
                    "id": 2,
                    "hospital": "Medical College",
                    "bloodGroup": "A+",
                    "time": "4 hours ago"
                },
                {
                    "id": 3,
                    "hospital": "City Hospital",
                    "bloodGroup": "B+",
                    "time": "6 hours ago"
                }
            ],
            "topHospitals": [
                {
                    "id": 1,
                    "name": "General Hospital",
                    "location": "Ernakulam",
                    "requests": 45
                },
                {
                    "id": 2,
                    "name": "Medical College",
                    "location": "Thiruvananthapuram",
                    "requests": 38
                },
                {
                    "id": 3,
                    "name": "City Hospital",
                    "location": "Kozhikode",
                    "requests": 32
                }
            ],
            "topDonors": [
                {
                    "id": 1,
                    "name": "John Doe",
                    "bloodGroup": "O+",
                    "donations": 5
                },
                {
                    "id": 2,
                    "name": "Jane Smith",
                    "bloodGroup": "A+",
                    "donations": 4
                },
                {
                    "id": 3,
                    "name": "Mike Johnson",
                    "bloodGroup": "B+",
                    "donations": 3
                }
            ]
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({"error": "Failed to fetch dashboard data"}), 500
