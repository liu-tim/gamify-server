# Gamify Server

## Description
The server for Gamify built using Node and [Socket.IO](https://github.com/socketio/socket.io).

## Requirements

- Mac OS X, Windows, or Linux
- Node.js v4.4.4 or newer
- npm v2.15.1 or newer


## Getting Started
### 1. Get the latest version

```
$ git clone https://github.com/liu-tim/react-starter-kit.git 
```

### 2. Install project dependencies

```
$ npm install
```

### 3. Run the server locally
```
$ node index.js 
```
The app will be listening to port 3000: [http://localhost:3000/](http://localhost:3000/)

### 4. Accessing the game room
Determine and record the server's network IP address using ``` ifconfig``` on UNIX systems or ``` ipconfig ``` on Windows.

Players can then join the game room by navigating to [http://&lt;server IP address&gt;:3000/](http://localhost:3000/) using an internet browser on mobile or desktop. 

Once in the game room, enter the player name and wait for instructions from the game moderator. 

## Android App
[Gamify-Android](https://github.com/benjaminlo/Gamify-Android) is the Android application that complements this server. It acts as the game moderator for the real-time multiplayer Gamify games.
