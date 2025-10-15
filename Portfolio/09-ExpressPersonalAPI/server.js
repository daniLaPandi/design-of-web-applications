// Basic Express Setup

// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // for JSON bodies (Postman)
app.use(express.static('public'));

let names = [];
let tasks = [];

// --- Root route ---
// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// GET/greet - Handle form submission

app.get('/greet', (req, res) => {
  const name = req.query.name;
  if (name) names.push(name);
  console.log('New name:', name);

  // Dynamically create HTML response
  let nameList = names
    .map(
      (n, i) =>
        `<li><a href="/greet/${i}">${n}</a></li>`
    )
    .join('');

  res.send(`
    <html>
      <body>
        <h1>Hello Express!</h1>
        <form action="/greet" method="get">
          <input type="text" name="name" placeholder="Enter your name" />
          <button type="submit">Greet Me</button>
        </form>
        <p>Hi ${name ? name : 'there'}!</p>
        <h3>People greeted:</h3>
        <ul>${nameList}</ul>
        <a href="/">Back to home</a>
      </body>
    </html>
  `);
});


// Individual gretting links (/greet/:index)

app.get('/greet/:index', (req, res, next) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= names.length) {
    const err = new Error('Invalid name index');
    err.status = 404;
    return next(err);
  }

  const name = names[index];
  res.redirect(`/wazzup.html?name=${name}`);
});


// PUT /greet/:name (Postman only)

app.put('/greet/:name', (req, res) => {
  const { name } = req.params;
  if (name) names.push(name);
  res.json(names);
});


// TODO List (POST, GET, DELETE)

// GET all tasks (Postman only)
app.get('/task', (req, res) => {
  res.json(tasks);
});

// POST new task
app.post('/task', (req, res) => {
  const { task } = req.body;
  if (task) tasks.push(task);
  res.redirect('/');
});

// DELETE a task by index
app.get('/task/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
  }
  res.redirect('/');
});

app.get('/task/up/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (i > 0 && i < tasks.length) {
    [tasks[i - 1], tasks[i]] = [tasks[i], tasks[i - 1]];
  }
  res.redirect('/');
});

app.get('/task/down/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (i >= 0 && i < tasks.length - 1) {
    [tasks[i + 1], tasks[i]] = [tasks[i], tasks[i + 1]];
  }
  res.redirect('/');
});


// Error Handling Middleware

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).send(`
    <html>
      <body>
        <h1>Error</h1>
        <p>${err.message}</p>
        <a href="/">Go back</a>
      </body>
    </html>
  `);
});



// Listener for port 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
