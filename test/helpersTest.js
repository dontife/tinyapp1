const { assert } = require("chai");

const { ifUserExists } = require("../helperFunction.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function() {
  it("should return a user with valid email", function() {
    const user = ifUserExists("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(expectedUserID, user);
  });
  it("should return undefined if we pass in an email that is not in our users database", function() {
    const user = ifUserExists("idontexist@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(expectedUserID, user);
  });
});