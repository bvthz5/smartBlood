from app import create_app
from app.extensions import db
from app.models import User
from passlib.hash import bcrypt

app = create_app()
with app.app_context():
    email = "admin@example.com"
    pwd = "AdminPass123!"
    existing = User.query.filter_by(email=email).first()
    if existing:
        print("Admin already exists:", existing.id, existing.email)
    else:
        user = User(name="Admin", email=email, password_hash=bcrypt.hash(pwd), role="admin", is_verified=True)
        db.session.add(user)
        db.session.commit()
        print("Admin seeded:", user.id, user.email)
