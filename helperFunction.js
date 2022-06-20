// checking for an email in the users object

const ifUserExists = function(email, database) {
 for(const user in database) {
   if (database[user].email === email) {
     return user;
   }
 }
 return undefined;
}

module.exports = {ifUserExists}