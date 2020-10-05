var moment = require("moment");

function calculate_birthday_diff(birthday) {
  const today = moment();
  birthday.set('year', today.year());
  if (today > birthday) {
    return 365 - today.diff(birthday, 'days');
  } else {
    return birthday.diff(today, 'days');
  }
}

function validate_input(username, dateOfBirthHeader) {
  const dateOfBirth = moment(dateOfBirthHeader);
  if (/^[a-z]+$/i.test(username) == false ||
    dateOfBirthHeader == null ||
    dateOfBirth == 'Invalid Date' ||
    moment().diff(dateOfBirth, 'days') <= 0
  ) {
    return -1;
  } else {
    return 0;
  }
}

module.exports = {
  calculate_birthday_diff,
  validate_input
};
