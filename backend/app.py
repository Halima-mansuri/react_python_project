from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000", "https://react-python-project-tzr1.onrender.com"], supports_credentials=True)


# App configuration
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///friends.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")  # Use environment variable

db = SQLAlchemy(app)

# 🔐 JWT Setup
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

jwt = JWTManager(app)

# Frontend configuration
frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Serve static files from the "dist" folder
# @app.route("/", defaults={"filename": ""})
# @app.route("/<path:filename>")
# def index(filename):
#     if not filename:
#         filename = "index.html"
#     return send_from_directory(dist_folder, filename)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    # Redirect any non-API request to index.html
    if path.startswith("api/"):
        return "Not Found", 404

    target_path = os.path.join(dist_folder, path)
    if os.path.exists(target_path) and os.path.isfile(target_path):
        return send_from_directory(dist_folder, path)
    return send_from_directory(dist_folder, "index.html")

# API Routes
from routes import *

# Create DB tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
