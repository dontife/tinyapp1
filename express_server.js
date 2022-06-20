const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { ifUserExists, ifPasswordMatches,  urlsForUser} = require("./helperFunction");
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const app = express();
// default port 8080
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ43lW"
  }

};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};
// generating a random unique number
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// endpoints using the get method
app.get('/', (req, res) => {
  res.send('Hello!');
});
app.get('/urls.json', (req, res) => {
  // sends a JSON response
  res.json(urlDatabase);
});
// index page
app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { user, urls: urlsForUser(userID, urlDatabase) };
  if (!userID) {
    return res.send("You don't have permission, please login or register.");
  }
  if(urlsForUser(userID, urlDatabase)){
    res.render('urls_index', templateVars);
  }
});
// new page 
app.get('/urls/new', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  // only registered and logged users can createa new tiny URLs
  if (!userID) {
    res.redirect('/login');
  }
  const templateVars = {
    user,
    // ... any other vars
  };
  res.render('urls_new', templateVars);
});
// endpoint to create a new account
app.get('/register', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    user,
  };
  res.render('register', templateVars);
});
// login page
app.get('/login', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    user,
  };
  res.render("login", templateVars);
});

// endpoints using the post method

app.post('/urls', (req,res) => {
  if (!req.cookies["user_id"]) {
    return res.send("You don't have permission, please login or register.");
  }
  let shortURL = generateRandomString();
  urlDatabase[shortURL] ={longURL: req.body.longURL, userID: req.cookies["user_id"]};;
  // redirect after submission
  res.redirect(`/urls`);
});
// login route to cookies
app.post('/login', (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  // checks if the email or password field is empty
  if (!email || !password) {
    return res.status(400).send('Please provide a valid email and password');
  };
    // checking to see if email exists 
  let userExists = ifUserExists(email, users);
  if (!userExists) {
    return res.status(403).send(`403: Email cannot be found.`)
  }
  let passwordExists = ifPasswordMatches(email, password, users);
  if (passwordExists) {
    res.cookie("user_id", passwordExists.id);
  return res.redirect('/urls');
  } else {
    return res.status(403).send(`403: The password provided is wrong.`);
  }
});
// logout route
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});
// Create a new account
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  // checks if the email or password field is empty
  if (!email || !password) {
    return res.status(400).send('Please provide a valid email and password');
  };
  // checking to see if user exists 
  let userExists = ifUserExists(email, users);
  if(userExists) {
    return res.status(400).send('Please provide another email, inputted email is in use');
  };
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = { id, email, password: hashPassword} ;
  users[id] = newUser;
  res.cookie('user_id', id);
  res.redirect('/urls')
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page requested was not found");
  }
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { shortURL: req.params.shortURL , longURL:urlDatabase[req.params.shortURL].longURL, user,};
  res.render('urls_show', templateVars);
});

// updating URLs
app.post('/urls/:shortURL', (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("You don't have permission, please login or register.");
  }
  const longerURL = req.body.longerURL;
  urlDatabase[req.params.shortURL].longURL = longerURL;
  return res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page requested was not found");
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.status(301).redirect(longURL);
});

// Delete an URL
app.post('/urls/:shortURL/delete', (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.send("You don't have permission, please login or register.");
  }
  let shortDel = req.params.shortURL;
  delete urlDatabase[shortDel];
  return res.redirect('/urls');
});

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


