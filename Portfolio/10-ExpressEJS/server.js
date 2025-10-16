const express = require("express");
const app = express();
const PORT = 3000;

const path = require("path");

// Middleware
app.use(express.static('public'));
app.use(express.json()); // JSON for input and output
app.use(express.urlencoded({ extended: true })); // to handle my forms
app.set("view engine", "ejs");
app.set('views', __dirname + '/public/html');

// Data storage (temporary in-memory)
let userName = "";
let posts = [];

// i dont know why this was in the default lol
const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

// my routes :)

// Root: serves static index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// Login via GET (unsecured)
app.get("/login", (req, res) => {
  userName = req.query.name;
  if (!userName) return res.redirect("/");
  res.render("test", { name: userName, method: "GET" });
});

// Login via POST (secured)
app.post("/login", (req, res) => {
  userName = req.body.name;
  if (!userName) return res.redirect("/");
  res.render("test", { name: userName, method: "POST" });
});

// Blog Home page
app.get("/home", (req, res) => {
  if (!userName) return res.redirect("/");
  res.render("home", { name: userName, posts });
});

// Add new blog post
app.post("/home", (req, res) => {
  if (!userName) return res.redirect("/");
  const { title, content } = req.body;
  if (title && content) {
    posts.push({ id: Date.now(), title, content });
  }
  res.redirect("/home");
});

// View one post
app.get("/post/:id", (req, res) => {
  if (!userName) return res.redirect("/");
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("post", { name: userName, post });
});

// Edit post (save changes)
app.post("/post/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
  }
  res.redirect("/home");
});

// Delete post
app.post("/post/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  res.redirect("/home");
});

// Start server
app.listen(PORT, (err) => {
  console.log(`Listening on port http://localhost:${PORT}`);
});