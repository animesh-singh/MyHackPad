
from gevent import monkey
monkey.patch_all()

from flask import Flask, render_template,redirect
from flask_socketio import SocketIO ,  send, emit
from pymongo import MongoClient

app = Flask(__name__)
app.config['SECRET_KEY'] = 'VerySecretKey'

client = MongoClient('mongodb://localhost:27017/')
db = client['MyHackPadDB']

socketio = SocketIO(app)



@app.route('/')
def load_index():
    return redirect("sample", code=302)

@app.route('/sample')
def load_sample():
    return render_template('sample.html')


@socketio.on('connect', namespace='/MyHackPad')
def ws_conn():
    socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")


if __name__ == '__main__':
    socketio.run(app)


@socketio.on('addUser', namespace='/MyHackPad')
def addUserDB(addUser):

    socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")

@socketio.on('removeUser', namespace='/MyHackPad')
def removeUserDB(removeUser):


    socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")



@socketio.on('receiveDiff', namespace='/MyHackPad')
def ws_conn(receiveDiff):


    socketio.emit('msg',{'count':"1"},namespace = "/MyHackPad")
