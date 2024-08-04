from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'lifedontcometoyoulifecomesfromyou'

client = MongoClient('mongodb+srv://yakshmahawer:sFb59PHwZpgIFzsH@fanwiki.qw587vy.mongodb.net/?retryWrites=true&w=majority&appName=FanWiki')
db = client.movieFanDB
users_collection = db.users
reviews_collection = db.reviews
theories_collection = db.fan_theories
comments_collection = db.comments

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

@app.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = list(reviews_collection.find({}, {'_id': 0}))  # Exclude the '_id' field from the response
    for i in range(len(reviews)):
        user_data = users_collection.find_one({'_id': ObjectId(reviews[i]['user_id'])})
        reviews[i]['user_name'] = user_data['name']
        reviews[i]['timestamp'] = reviews[i].get('timestamp')
    return jsonify(reviews), 200

@app.route('/fantheories', methods=['GET'])
def get_fantheories():
    theories = list(theories_collection.find({}))
    for i in range(len(theories)):
        theories[i]['_id'] = str(theories[i]['_id'])  # Convert ObjectId to string
        user_data = users_collection.find_one({'_id': ObjectId(theories[i]['user_id'])})
        theories[i]['user_name'] = user_data['name']
        theories[i]['user_id'] = str(theories[i]['user_id'])  # Convert ObjectId to string
        theories[i]['timestamp'] = theories[i].get('timestamp')
        
        # Fetch root comments (parent_id is None) and convert each comment's ObjectId to string
        comments_cursor = comments_collection.find({'theory_id': theories[i]['_id'], 'parent_id': None})
        comments = list(comments_cursor)
        for comment in comments:
            comment['_id'] = str(comment['_id'])
            comment['user_id'] = str(comment['user_id'])
            commenter_name = users_collection.find_one({'_id': ObjectId(comment['user_id'])})
            comment['name'] = commenter_name['name']
        theories[i]['comments'] = comments
        user_action = None
        if 'likes' in theories[i]:
            theories[i]['likes'] = [str(like) for like in theories[i]['likes']]  # Convert ObjectId in likes to string
        if 'dislikes' in theories[i]:
            theories[i]['dislikes'] = [str(dislike) for dislike in theories[i]['dislikes']]  # Convert ObjectId in dislikes to string

        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split()[1]
            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                user_id = data['user_id']
                if user_id in theories[i]['likes']:
                    user_action = 'liked'
                elif user_id in theories[i]['dislikes']:
                    user_action = 'disliked'
            except:
                pass
        theories[i]['user_action'] = user_action
    return jsonify(theories), 200

@app.route('/theories/<theory_id>/like', methods=['POST'])
def like_theory(theory_id):
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'message': 'Token is invalid or expired'}), 401

    theory = theories_collection.find_one({'_id': ObjectId(theory_id)})
    if theory:
        # Remove user from dislikes if present
        if 'dislikes' in theory and user_id in theory['dislikes']:
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$pull': {'dislikes': user_id}})
        # Add user to likes if not already present
        if 'likes' not in theory:
            theory['likes'] = []
        if user_id not in theory['likes']:
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$push': {'likes': user_id}})
            theory['user_action'] = 'liked'
        else:
            # If user already liked, remove the like
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$pull': {'likes': user_id}})
            theory['user_action'] = None
        updated_theory = theories_collection.find_one({'_id': ObjectId(theory_id)})
        # Convert ObjectId fields to strings
        updated_theory['_id'] = str(updated_theory['_id'])
        if 'user_id' in updated_theory:
            updated_theory['user_id'] = str(updated_theory['user_id'])
        if 'likes' in updated_theory:
            updated_theory['likes'] = [str(like) for like in updated_theory['likes']]
        if 'dislikes' in updated_theory:
            updated_theory['dislikes'] = [str(dislike) for dislike in updated_theory['dislikes']]
        user_data = users_collection.find_one({'_id': ObjectId(updated_theory['user_id'])})
        updated_theory['user_name'] = user_data['name']
        # Fetch root comments (parent_id is None) and convert each comment's ObjectId to string
        comments_cursor = comments_collection.find({'theory_id': updated_theory['_id'], 'parent_id': None})
        comments = list(comments_cursor)
        for comment in comments:
            comment['_id'] = str(comment['_id'])
            comment['user_id'] = str(comment['user_id'])
            commenter_name = users_collection.find_one({'_id': ObjectId(comment['user_id'])})
            comment['name'] = commenter_name['name']
        updated_theory['comments'] = comments
        return jsonify(updated_theory), 200
    return jsonify({'message': 'Theory not found'}), 404

@app.route('/theories/<theory_id>/dislike', methods=['POST'])
def dislike_theory(theory_id):
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'message': 'Token is invalid or expired'}), 401

    theory = theories_collection.find_one({'_id': ObjectId(theory_id)})
    if theory:
        # Remove user from likes if present
        if 'likes' in theory and user_id in theory['likes']:
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$pull': {'likes': user_id}})
        # Add user to dislikes if not already present
        if 'dislikes' not in theory:
            theory['dislikes'] = []
        if user_id not in theory['dislikes']:
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$push': {'dislikes': user_id}})
            theory['user_action'] = 'disliked'
        else:
            # If user already disliked, remove the dislike
            theories_collection.update_one({'_id': ObjectId(theory_id)}, {'$pull': {'dislikes': user_id}})
            theory['user_action'] = None
        updated_theory = theories_collection.find_one({'_id': ObjectId(theory_id)})
        # Convert ObjectId fields to strings
        updated_theory['_id'] = str(updated_theory['_id'])
        if 'user_id' in updated_theory:
            updated_theory['user_id'] = str(updated_theory['user_id'])
        if 'likes' in updated_theory:
            updated_theory['likes'] = [str(like) for like in updated_theory['likes']]
        if 'dislikes' in updated_theory:
            updated_theory['dislikes'] = [str(dislike) for dislike in updated_theory['dislikes']]
        user_data = users_collection.find_one({'_id': ObjectId(updated_theory['user_id'])})
        updated_theory['user_name'] = user_data['name']
        # Fetch root comments (parent_id is None) and convert each comment's ObjectId to string
        comments_cursor = comments_collection.find({'theory_id': updated_theory['_id'], 'parent_id': None})
        comments = list(comments_cursor)
        for comment in comments:
            comment['_id'] = str(comment['_id'])
            comment['user_id'] = str(comment['user_id'])
            commenter_name = users_collection.find_one({'_id': ObjectId(comment['user_id'])})
            comment['name'] = commenter_name['name']
        updated_theory['comments'] = comments
        return jsonify(updated_theory), 200
    return jsonify({'message': 'Theory not found'}), 404

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
    post_data['timestamp'] = datetime.datetime.utcnow()
    post_type = post_data.get('type')

    if post_type == 'Review':
        reviews_collection.insert_one(post_data)
    else:
        theories_collection.insert_one(post_data)

    return jsonify({'message': 'Post added successfully'}), 201

@app.route('/logout', methods=['POST'])
def logout():
    # For simplicity, we'll assume that the client handles token removal
    # You might also consider implementing token blacklisting in a real application

    # Respond to indicate logout success
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/viewreplies', methods=['POST'])
def view_replies():
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except:
        return jsonify({'message': 'Token is invalid or expired'}), 401

    post_data = request.get_json()
    print(post_data)
    theory_id = post_data['theory_id']
    parent_id = post_data['comment_id']

    # Fetch replies based on theory_id and parent_id
    replies = list(comments_collection.find({'theory_id': theory_id, 'parent_id': parent_id}))
    for reply in replies:
        reply['_id'] = str(reply['_id'])
        reply['user_id'] = str(reply['user_id'])
        commenter_name = users_collection.find_one({'_id': ObjectId(reply['user_id'])})
        reply['name'] = commenter_name['name']
    print(replies)
    return jsonify(replies), 200

@app.route('/postcomment', methods=['POST'])
def postComment():
    token = request.headers.get('Authorization').split()[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'message': 'Token is invalid or expired'}), 401
    post_data = request.get_json()
    post_data['user_id'] = user_id
    post_data['timestamp'] = datetime.datetime.utcnow()
    comments_collection.insert_one(post_data)
    return jsonify({'message': 'Comment Posted Successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)