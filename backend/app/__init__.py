from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt
from .auth.routes import auth_bp
from .donor.routes import donor_bp
from .admin.routes import admin_bp
from .requests.routes import req_bp
from .admin.match_routes import admin_match_bp

def create_app(config_class=Config):
    app = Flask(__name__, static_folder=None)
    app.config.from_object(config_class)

    # init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(donor_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(req_bp)
    app.register_blueprint(admin_match_bp)
  

    @app.route("/")
    def index():
        return {"status":"ok","service":"SmartBlood backend"}

    return app
