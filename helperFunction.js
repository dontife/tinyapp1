const bcrypt = require("bcryptjs");

// checking for an email in the users object
const ifUserExists = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
};


// Checks if the password matches with on in the database
const ifPasswordMatches = function(email, password, database) {
  for (const user in database) {
    if (database[user].email === email) {
      if (bcrypt.compareSync(password, database[user].password)) {
        return database[user];
      }
    }
  }
  return undefined;
};

// returns URLs where the userID is equal to the id currently logged-in user
const urlsForUser = function(id, database) {
  let urls = {};
  for (let url in database) {
    if (database[url].userID === id) {
      urls[url] = database[url];
    }
  }
  return urls;
};

// generating a random unique number
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = {ifUserExists, ifPasswordMatches, urlsForUser, generateRandomString};