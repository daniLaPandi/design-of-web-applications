const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true })); // this allows Express to read data from HTML form submissiones
app.use(express.json()); // allows Express to read JSON data (like from Postman or API clients)

app.set('view engine', 'ejs'); // uses ejs to render templates
app.set('views', path.join(__dirname, 'views')); // where to look for templates

let names = [];
let tasks = [];
let currentName;

//  root route 
app.get('/', (req, res) => {
  res.render('index', { names, tasks, currentName: null });
});

//  /greet route 
app.get('/greet', (req, res) => {
  const name = req.query.name;
  if (name) names.push(name);
  console.log('New name:', name);
  res.render('index', { names, tasks, currentName: name }); // updates after every new name added
});

//  /greet/:index 
app.get('/greet/:index', (req, res, next) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= names.length) {
    const err = new Error('Invalid name index');
    err.status = 404;
    return next(err);
  }

  const name = names[index];
  res.render('wazzup', { name });
});

//  PUT /greet/:name (Postman only) 
app.put('/greet/:name', (req, res) => {
  const { name } = req.params;
  if (name) names.push(name);
  res.json(names);
});

//  tasks 
app.get('/task', (req, res) => {
  res.json(tasks); // For Postman
});

app.post('/task', (req, res) => {
  const { task } = req.body;
  if (task) tasks.push(task);
  res.redirect('/');
});

app.get('/task/delete/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (i >= 0 && i < tasks.length) tasks.splice(i, 1);
  res.redirect('/');
});

app.get('/task/up/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (i > 0 && i < tasks.length) [tasks[i - 1], tasks[i]] = [tasks[i], tasks[i - 1]];
  res.redirect('/');
});

app.get('/task/down/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (i >= 0 && i < tasks.length - 1)
    [tasks[i + 1], tasks[i]] = [tasks[i], tasks[i + 1]];
  res.redirect('/');
});

//  error handling 
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).render('error', { message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
