'use strict';

const express = require("express");
const app = express()

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

function calculate_birthday_diff(birthday) {
  // TODO: Consider moment.js library to simplify this solution
  const today = new Date();
  birthday.setFullYear(today.getFullYear());
  const diffTimeMs = today - birthday;
  var diffDays = Math.ceil(diffTimeMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    diffDays = 365 - diffDays;
  }
  else if (diffDays < 0) {
    diffDays = Math.abs(diffDays);
  }
  return diffDays;
}

// App
app.get('/hello/:username', (req, res) => {
  const username = req.params.username;

  const mockBirthday = new Date('1993-12-12'); // TODO: Get birthday date from DB

  const daysToBirthday = calculate_birthday_diff(mockBirthday);
  if (daysToBirthday == 0) {
    res.send('Hello, ' + username + '! Happy birthday!');
  } else {
    res.send('Hello, ' + username + '! Your birthday is in ' + daysToBirthday + ' day(s)');
  }
});

app.put('/hello/:username', (req, res) => {
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
  const dateOfBirth = new Date(dateOfBirthHeader);
  if (dateOfBirth == 'Invalid Date') {
    res.status(400).send("Invalid date format");
    return;
  }

  // date before today check
  const today = new Date();
  if (today.getDate() - dateOfBirth.getDate() == 0) {
    res.status(400).send("Date must be before current date");
    return;
  }

  // TODO: Apply username with birthday to DB

  res.status(200);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
