from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Relationship to friends
    friends = db.relationship('Friend', backref='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

class Friend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=True)

    # Foreign key to link to User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "description": self.description,
            "gender": self.gender,
            "imgUrl": self.img_url,
            "userId": self.user_id
        }
