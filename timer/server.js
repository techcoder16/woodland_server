const express = require('express');
const { MongoClient } = require('mongodb');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
const cors = require('cors');

// Load configuration
const config = require('./config.json');

// MongoDB connection
const client = new MongoClient("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 
});

let db, activeCallsCollection, settingsCollection,teamCollections;

const timers = {};


function saveElapsedTime(uid, elapsedTime) {
  const filePath = path.join(__dirname, 'elapsed_times.json');
  let data = {};

  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileData);
  }

  data[uid] = elapsedTime;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Function to set timer for each UID
function setTimer(uid, idleTime) {
  function timerAction(uid) {
    console.log(`${DateTime.now().toISO()} - User ${uid} has been idle for too long.`);
    saveElapsedTime(uid, idleTime * 60);
  }

  console.log(`Setting timer for user ${uid} with idle time ${idleTime} minutes`);
  const timer = setTimeout(timerAction, idleTime * 60 * 1000, uid);
  timers[uid] = {
    timer,
    startTime: Date.now(),
    idleTime: idleTime * 60 * 1000,
    accumulatedIdleTime: 0,
  };
}

// Function to update and display elapsed time
function updateElapsedTime(uid) {
  setInterval(() => {
    if (timers[uid]) {
      const elapsedTime = Date.now() - timers[uid].startTime + timers[uid].accumulatedIdleTime;
      
      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
      
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      console.log(`User ${uid} elapsed time: ${formattedTime}`);
    }
  }, 1000);
}

async function checkIdleStatus() {
  
  const activeCalls = await activeCallsCollection.find({}).toArray();
  const settings = await settingsCollection.findOne({});
  const idleTimeLimit = settings.time || config.timeData;

  activeCalls.forEach((call) => {
    const uid = call.uid;

    // Check if the user's presence is 'open' and a timer isn't already set
    if (call.presence === 'open' && !timers[uid]) {
      setTimer(uid, idleTimeLimit);
      updateElapsedTime(uid); // Start updating elapsed time for the user
    } else if (call.presence !== 'open' && timers[uid]) {
      // Clear the timer if the user's presence changes to not 'open'
      
      clearTimeout(timers[uid].timer);
      delete timers[uid];
    }
  });
}

async function main() {
  try {
    await client.connect();
    db = client.db(config.databaseName);
    activeCallsCollection = db.collection('active_calls');
    settingsCollection = db.collection('settings');
    teamCollections = db.collection('UserTeam');
    
    // Schedule periodic idle status checks
    schedule.scheduleJob(`*/${config.checkInterval} * * * * *`, checkIdleStatus);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    setTimeout(main, 5000);
  }
}

main();

const app = express();
app.use(cors());

// Function to get simplified timers data
function getSimplifiedTimers() {
  const simplifiedTimers = {};
  for (const uid in timers) {
    if (timers.hasOwnProperty(uid)) {
      const timer = timers[uid];
      const elapsedTime = Date.now() - timer.startTime + timer.accumulatedIdleTime;

      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      simplifiedTimers[uid] = {
        elapsedTime: formattedTime,
      };
    }
  }
  return simplifiedTimers;
}

app.get('/api/timers/:email', async (req, res) => {
  try {
    const ext = [];
    const email = req.params.email;
    
    const teams = 
   await teamCollections.find({User:email}).toArray();

    teams[0].team.map ((item)=>{
        
      ext.push(item.split(":")[1]);

    })
    
    const activeCalls = await activeCallsCollection.find({ user: { $in: ext } }).toArray();
    
    // const activeCalls = await activeCallsCollection.find({}).toArray();
    const simplifiedTimers = getSimplifiedTimers();
    const mergedData = activeCalls.map(call => ({
      ...call,
      timer: simplifiedTimers[call.uid] ? simplifiedTimers[call.uid].elapsedTime : '00:00:00'
    }));
 
    res.json({ calls:mergedData});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch timers' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
