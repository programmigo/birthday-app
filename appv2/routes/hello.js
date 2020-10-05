var database = require('../utils/database');
var utils = require('../utils/utils');
var moment = require("moment");
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.sendStatus(404);
});

router.get('/:username', async (req, res) => {
  const username = req.params.username;
  const birthday = await database.get_birthday(username, res);
  if (birthday != null) {
    const daysToBirthday = utils.calculate_birthday_diff(birthday);
    if (daysToBirthday == 0) {
      res.status(200).send('Hello, ' + username + '! Happy birthday!');
    } else {
      res.status(200).send('Hello, ' + username + '! Your birthday is in ' + daysToBirthday + ' day(s)');
    }
  }
});

router.put('/:username', async (req, res) => {
  const username = req.params.username;
  const dateOfBirthHeader = req.header('dateOfBirth');

  if (utils.validate_input(username, dateOfBirthHeader) != 0) {
    return res.sendStatus(400);
  }

  const error_code = await database.store_birthday(username, moment(dateOfBirthHeader));
  if (error_code == 0) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

module.exports = router;
