const fs = require('fs'); // imports Node.js's File System module to interact with files
const path = require('path');
const { parse } = require('csv-parse/sync'); // import the synchronous parser to turn the CSV text into JS obejects
const Driver = require('../models/Driver'); // import the mongoose model for a driver
const Team = require('../models/Team'); // import the mongoose model for a team
// for each team i want to store a list of the drivers; so basically, if mercedes, store the driver model in that model
let loaded = false; //a flag to check if the CSV data has already been loaded into the DB (to only run it once)

module.exports = async function (req, res, next) {
  try {
    if (loaded) return next();
    if (!(req.path === '/' || req.path === '/index')) return next();

    const csvPath = path.join(__dirname, '..', 'public', 'data', 'f1_2023.csv');
    if (!fs.existsSync(csvPath)) { // checks if the file exists 
      loaded = true; // if it doesnt it marks the flag true and exits this code
      return next();
    }

    const content = fs.readFileSync(csvPath, 'utf8'); // read and store this whole file
    const records = parse(content, {
      columns: true, // treat the first row of the CSV data as the header row
      skip_empty_lines: true,
      trim: true,
      bom: true
    }); // cleans up the data

    // 1. Extract and Create Teams first
    const teamMap = new Map(); // Name -> ObjectId

    for (const r of records) {
      const teamName = r.current_team ? r.current_team.trim() : null;
      if (teamName && !teamMap.has(teamName)) {
        let teamDoc = await Team.findOne({ name: teamName });
        if (!teamDoc) {
          teamDoc = new Team({ name: teamName, drivers: [] });
          await teamDoc.save();
        }
        teamMap.set(teamName, teamDoc._id);
      }
    }

    // 2. Create/Update Drivers
    for (const r of records) {
      const number = parseInt(r.number);
      if (isNaN(number)) {
        console.warn(`Skipping record with invalid number value: ${r.number}`);
        continue;
      }

      const teamId = r.current_team ? teamMap.get(r.current_team.trim()) : null;

      let driver = await Driver.findOne({ number });
      if (!driver) {
        driver = new Driver({
          number: parseInt(r.number, 10),
          code: r.code,
          forename: r.forename,
          surname: r.surname,
          dob: r.dob,
          nationality: r.nationality,
          url: r.url,
          team: teamId
        });
        await driver.save();
      } else {
        // Update existing driver's team if needed (optional, but good for consistency)
        if (teamId && (!driver.team || driver.team.toString() !== teamId.toString())) {
          driver.team = teamId;
          await driver.save();
        }
      }

      // Update the team's drivers array
      if (teamId) {
        await Team.findByIdAndUpdate(teamId, { $addToSet: { drivers: driver._id } });
      }
    }

    loaded = true;
    next();
  } catch (err) {
    console.error('❌ CSV load middleware error', err);
    loaded = true;
    next();
  }
};