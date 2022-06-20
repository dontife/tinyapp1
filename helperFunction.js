// checking for an email in the users object
const ifUserExists = function(email, database) {
 for(const user in database) {
   if (database[user].email === email) {
     return user;
   }
 }
 return undefined;
}


// Checks if the password matches with on in the database
const ifPasswordMatches = function(email, password, database) {
  for (const user in database) {
    if (database[user].email === email) {
      if (password === database[user].password) {
        return database[user];
      }
    }
  }
  return undefined;
};
module.exports = {ifUserExists, ifPasswordMatches, }