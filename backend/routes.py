from app import app, db
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Friend, User
from datetime import timedelta

# -----------------------
# Auth Routes
# -----------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists."}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json()), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1))
        return jsonify({"access_token": access_token, "user": user.to_json()}), 200
    return jsonify({"error": "Invalid credentials."}), 401


# -----------------------
# Friend Routes (Protected)
# -----------------------
@app.route("/api/friends", methods=["GET"])
@jwt_required()
def get_friends():
    user_id = get_jwt_identity()
    friends = Friend.query.filter_by(user_id=user_id).all()
    result = [friend.to_json() for friend in friends]
    return jsonify(result), 200


@app.route("/api/friends", methods=["POST"])
@jwt_required()
def create_friend():
    try:
        data = request.json
        user_id = get_jwt_identity()

        required_fields = ["name", "role", "description", "gender"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")

        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else:
            img_url = None

        new_friend = Friend(
            name=name,
            role=role,
            description=description,
            gender=gender,
            img_url=img_url,
            user_id=user_id
        )
        db.session.add(new_friend)
        db.session.commit()
        return jsonify(new_friend.to_json()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/friends/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_friend(id):
    try:
        user_id = get_jwt_identity()
        friend = Friend.query.filter_by(id=id, user_id=user_id).first()
        if friend is None:
            return jsonify({"error": "Friend not found."}), 404

        db.session.delete(friend)
        db.session.commit()
        return jsonify({"msg": "Friend was deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/friends/<int:id>", methods=["PATCH"])
@jwt_required()
def update_friend(id):
    try:
        user_id = get_jwt_identity()
        friend = Friend.query.filter_by(id=id, user_id=user_id).first()
        if friend is None:
            return jsonify({"error": "Friend not found."}), 404

        data = request.json

        friend.name = data.get("name", friend.name)
        friend.role = data.get("role", friend.role)
        friend.description = data.get("description", friend.description)
        friend.gender = data.get("gender", friend.gender)

        db.session.commit()
        return jsonify(friend.to_json()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
