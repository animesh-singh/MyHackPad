import datetime

from gevent import monkey
from flask import Flask, render_template,redirect,session,request
from flask_socketio import SocketIO ,  send, emit
from pymongo import MongoClient
monkey.patch_all()


# Connection settings for pymongo
client = MongoClient('mongodb://localhost:27017/')
db = client['MyHackPadDB']
commits = db.commit_log
users = db.users
usersConnected = 1


# Connection settings for flask-socketio
app = Flask(__name__)
# app.config['SECRET_KEY'] = 'VerySecretKey'
async_mode = None
socketio = SocketIO (app , async_mode=async_mode )



# Application routing logic
@app.route('/')
def load_index():
    return redirect("sample", code=302)

@app.route('/sample')
def load_sample():
    return render_template('sample.html')





# Initialize the app
if __name__ == '__main__':
    socketio.run(app)




@socketio.on('connect', namespace='/MyHackPad')
def ws_conn():
    socketio.emit('userCount',{"count":usersConnected, "status" : "OK"},namespace = "/MyHackPad")


@socketio.on('disconnect', namespace='/MyHackPad')
def ws_conn():
    socketio.emit('userCount',{"count":usersConnected , "status" : "OK"},namespace = "/MyHackPad")




@socketio.on('receiveDiff', namespace='/MyHackPad')
def receiveDiff(data):
	print data

	post = { "username"  : data['username'],
			 "patchText" : data['patchText'],
			 "textValue" : data['textValue'],
	         "date": datetime.datetime.utcnow()}

	post_id = commits.insert_one(post).inserted_id

	socketio.emit('applyDiff',{"data": data }, broadcast=True ,namespace = "/MyHackPad")





# @socketio.on('addUser', namespace='/MyHackPad')
# def addUserDB(addUser):
#     socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")


# @socketio.on('removeUser', namespace='/MyHackPad')
# def removeUserDB(removeUser):
#     socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")


