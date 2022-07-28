const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
