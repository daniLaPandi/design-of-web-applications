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

// first handle the driver
    for (const r of records) {
      const number = parseInt(r.number);
      if (isNaN(number)) {
        console.warn(`Skipping record with invalid number value: ${r.number}`);
        continue;
      }

      const existing = await Driver.findOne({ number });
      if (!existing) {
        const driver = new Driver({
          number: parseInt(r.number, 10),
          code: r.code,
          forename: r.forename,
          surname: r.surname,
          dob: r.dob,
          nationality: r.nationality,
          url: r.url,
          team: r.current_team
        });
        await driver.save();
      }

    }

// second handle the team
    for (const r of records) {
      const teamName = r.current_team ? r.current_team.trim() : null; // if the team exists assign it
      let teamDoc = null;

      if (teamName) {
        teamDoc = await Team.findOne({ name: teamName })

        if (!teamDoc) {
          const tempDrivers = await Driver.find({ team: teamName })

          teamDoc = new Team({
            name: teamName,
            drivers: tempDrivers
          })
          await teamDoc.save();
        }
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