var request = require("supertest");
var app = require('../app');

test("It should response the GET method", () => {
  return request(app)
    .get("/")
    .then(response => {
      expect(response.statusCode).toBe(200);
    });
});
