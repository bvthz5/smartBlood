from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .models import db

migrate = Migrate()
jwt = JWTManager()
