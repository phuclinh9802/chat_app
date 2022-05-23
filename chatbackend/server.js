const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { getUser, userDisconnect, joinUser } = require("./dummyuser");

app.use(express());

const port = 8000;

app.use(cors());

var server = app.listen(
  port,
  console.log(`Server is running on the port: ${port}`.green)
);

// initialize socket
const io = socket(server);

// initialize connection
io.on("connection", (socket) => {
  // for a new user joining
  socket.on("joinRoom", ({ username, roomname }) => {
    // create user
    const p_user = joinUser(socket.id, username, roomname);
    console.log(socket.id, "= id");
    socket.join(p_user.room);

    // display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });

    // displays a joined room message to all other rooms except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });

  // user sending message
  socket.on("chat", (text) => {
    // gets the room user and the message sent
    const p_user = getUser(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  // when the user exits the room
  socket.on("disconnect", () => {
    // the user is deleted from array of users and a left room message displayed
    const p_user = userDisconnect(socket.id);

    // check if user is found or not
    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
  });
});
