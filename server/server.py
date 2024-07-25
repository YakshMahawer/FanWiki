#sFb59PHwZpgIFzsH
#mongodb+srv://yakshmahawer:sFb59PHwZpgIFzsH@fanwiki.qw587vy.mongodb.net/?retryWrites=true&w=majority&appName=FanWiki
#lifedontcometoyoulifecomesfromyou
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'lifedontcometoyoulifecomesfromyou'

client = MongoClient('mongodb+srv://yakshmahawer:sFb59PHwZpgIFzsH@fanwiki.qw587vy.mongodb.net/?retryWrites=true&w=majority&appName=FanWiki')
db = client.movieFanDB
users_collection = db.users
reviews_collection = db.reviews
theories_collection = db.fan_theories

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({'name': name, 'email': email, 'password': hashed_password})

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/review', methods=['POST'])
def add_review():
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'message': 'Token is invalid or expired'}), 401

    post_data = request.get_json()
    post_data['user_id'] = user_id
    post_type = post_data.get('type')

    if post_type == 'Review':
        reviews_collection.insert_one(post_data)
    else:
        theories_collection.insert_one(post_data)

    return jsonify({'message': 'Post added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)