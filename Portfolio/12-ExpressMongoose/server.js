// server.js
const express = require('express'); // imports express library to build web server
const path = require('path'); // imports the path utility to help manage and join directory paths
const mongoose = require('mongoose'); // imports mongoose, easier to work with the MongoDB database
const bodyParser = require('body-parser'); // helps server read and understand data sent from a web form
const csv = require('csv-parse'); // used to read and understad data stored in a CSV file
const fs = require('fs'); // import file system, lets server read and write files on the compu
const loadCsvMiddleware = require('./middleware/loadCsv'); // runs this code before a request is processed to make sure inital data is loaded
const Driver = require('./models/Driver'); // defines the structure (schema) for how Driver data should look in the db
const Team = require('./models/Team'); // ditto

const app = express(); // creates the actual Express web aplication (the server itself)

// === CONFIG ===
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/f1db'; // connects to the local database
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE ===
app.set('view engine', 'ejs'); // tells express to use EJS as the template engine to create dynamic html pages 
app.set('views', path.join(__dirname, 'views')); // tells express where to find said EJS templates
app.use('/css', express.static(path.join(__dirname, 'public/css'))); // serve static files to allow access to them from the browser
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(bodyParser.urlencoded({ extended: true })); //  possible to read and process form data (url encoded and json data sent in requests)
app.use(bodyParser.json());

// connect to mongo
mongoose.connect(MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo connection error', err));

// runs localCsvMiddleware to ensure CSV data is loaded on landing route
app.use('/', loadCsvMiddleware);

// === ROUTES ===
app.get('/', async (req, res) => { // runs when a user visits the main page with a GET method
  // middleware ensured teams and drivers exist
  const drivers = await Driver.find().populate('team').lean();
  const teams = await Team.find().populate('drivers').lean(); // give every team in collections

  // Get unique nationalities from existing drivers in the database
  const uniqueNationalities = await Driver.distinct('nationality');
  const countries = uniqueNationalities
    .filter(n => n && n.trim()) // remove null/empty values
    .sort()
    .map(nat => ({ code: nat, label: nat }));

  res.render('index', { teams, drivers, countries });
});

// Create new driver
app.post('/driver', async (req, res) => {
  try {
    const { number, code, name, lname, dob, url, nation, team } = req.body;
    // find the team document
    const teamDoc = await Team.findOne({ name: team });
    if (!teamDoc) return res.status(400).send('Team not found');
    // prevent duplicates by unique number or code; update if exists
    let driver = await Driver.findOne({ number: number });
    const oldTeamId = driver ? driver.team : null;

    if (driver) {
      // update existing
      driver.code = code;
      driver.forename = name;
      driver.surname = lname;
      driver.dob = dob;
      driver.url = url;
      driver.nationality = nation;
      driver.team = teamDoc._id;
      await driver.save();
    } else {
      driver = new Driver({
        number, code, forename: name, surname: lname,
        dob, url, nationality: nation, team: teamDoc._id
      });
      await driver.save();
    }

    // Update team's drivers array: remove from old team if changed
    if (oldTeamId && oldTeamId.toString() !== teamDoc._id.toString()) {
      await Team.findByIdAndUpdate(oldTeamId, { $pull: { drivers: driver._id } });
    }

    // Add to new team (using $addToSet to prevent duplicates)
    await Team.findByIdAndUpdate(teamDoc._id, { $addToSet: { drivers: driver._id } });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update driver via JSON (used by edit-in-place)
app.put('/driver/:id', async (req, res) => {
  try {
    const payload = req.body;
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const oldTeamId = driver.team;

    if (payload.team) {
      const teamDoc = await Team.findOne({ name: payload.team });
      if (!teamDoc) return res.status(400).json({ error: 'Team not found' });
      driver.team = teamDoc._id;

      // Update team's drivers array: remove from old team if changed
      if (oldTeamId && oldTeamId.toString() !== teamDoc._id.toString()) {
        await Team.findByIdAndUpdate(oldTeamId, { $pull: { drivers: driver._id } });
      }

      // Add to new team (using $addToSet to prevent duplicates)
      await Team.findByIdAndUpdate(teamDoc._id, { $addToSet: { drivers: driver._id } });
    }

    ['number', 'code', 'forename', 'surname', 'url', 'nationality'].forEach(k => {
      if (payload[k] !== undefined) driver[k] = payload[k];
    });

    if (payload.dob) driver.dob = payload.dob;

    await driver.save();
    const populated = await driver.populate('team');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete driver
app.delete('/driver/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (driver && driver.team) {
      // Remove driver from team's drivers array
      await Team.findByIdAndUpdate(driver.team, { $pull: { drivers: driver._id } });
    }
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Put team update (editable also)
app.put('/team/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    ['name', 'nationality', 'url', 'id'].forEach(k => {
      if (req.body[k] !== undefined) team[k] = req.body[k];
    });
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening ${PORT}`));