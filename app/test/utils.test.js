var request = require("supertest");
var utils = require('../utils/utils');

test('Wrong username, valid date', () => {
  expect(utils.validate_input('0user', '1998-01-01')).toBe(-1);
});

test('Valid username, date from future', () => {
  expect(utils.validate_input('testUsername', '9999-01-01')).toBe(-1);
});

test('Valid input', () => {
  expect(utils.validate_input('testUsername', '1999-01-01')).toBe(0);
});