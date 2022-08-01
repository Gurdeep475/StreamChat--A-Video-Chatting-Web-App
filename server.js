const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { ExpressPeerServer } = require("peer");
const { text } = require("express");
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room ,user: uuidv4()});
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on('message',(message,user) => {
      io.to(roomId).emit('createMessage',message,user);
    })
  });

});

