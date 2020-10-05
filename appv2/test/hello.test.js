var request = require("supertest");
var app = require('../app');

test("It should response the GET method", () => {
  return request(app)
    .get("/hello")
    .then(response => {
      expect(response.statusCode).toBe(404);
    });
});
