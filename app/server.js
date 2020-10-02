'use strict';

const express = require("express");
const moment = require("moment");
const Firestore = require('@google-cloud/firestore');
const app = express()

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const db = new Firestore({ projectId: process.env.GCP_PROJECT });

// Firebase functions
async function get_birthday(username, res) {
  try {
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (!doc.exists) {
      res.sendStatus(404);
    } else {
      return moment.unix(doc.data().birthday);
    }
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  return null;
}

async function store_birthday(username, birthday) {
  try {
    const docRef = db.collection('users').doc(username);
    await docRef.set({
      birthday: birthday
    });
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
}

// Helpers
function calculate_birthday_diff(birthday) {
  const today = moment();
  birthday.set('year', today.year());
  if (today > birthday) {
    return 365 - today.diff(birthday, 'days');
  } else {
    return birthday.diff(today, 'days');
  }
}

// App
app.get('/', (req, res) => {
  res.status(200).send("Hello from Birthday app!");
});

app.get('/hello/:username', async (req, res) => {
  const username = req.params.username;
  const birthday = await get_birthday(username, res);
  if (birthday != null) {
    const daysToBirthday = calculate_birthday_diff(birthday);
    if (daysToBirthday == 0) {
      res.status(200).send('Hello, ' + username + '! Happy birthday!');
    } else {
      res.status(200).send('Hello, ' + username + '! Your birthday is in ' + daysToBirthday + ' day(s)');
    }
  }
});

app.put('/hello/:username', async (req, res) => {
  const username = req.params.username;
  const dateOfBirthHeader = req.header('dateOfBirth');

  // only letters check
  if (/^[a-z]+$/i.test(username) == false) {
    res.status(400).send("username must contain only letters");
    return;
  }

  // check if date is null
  if (dateOfBirthHeader == null) {
    res.status(400).send("Birthday date has to be provided");
    return;
  }

  // check date format
  const dateOfBirth = moment(dateOfBirthHeader);
  if (dateOfBirth == 'Invalid Date') {
    res.status(400).send("Invalid date format");
    return;
  }

  // date before today check
  if (moment().diff(dateOfBirth, 'days') == 0) {
    res.status(400).send("Date must be before current date");
    return;
  }

  const error_code = await store_birthday(username, dateOfBirth);
  if (error_code == 0) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
