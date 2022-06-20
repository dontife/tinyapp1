const express = require('express');
const cookieParser = require('cookie-parser');
const { ifUserExists, ifPasswordMatches} = require("./helperFunction");
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const app = express();
// default port 8080
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const urlDatabase = {
  'b2xVn2' : 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'

};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
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
  const templateVars = { user, urls : urlDatabase };
  res.render('urls_index', templateVars);
});
// new page 
app.get('/urls/new', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
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
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  // redirect after submission
  res.redirect(`/urls/${shortURL}`);
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
  users[id] = {id, email, password}
  res.cookie('user_id', id);
  res.redirect('/urls')
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL], user,};
  res.render('urls_show', templateVars);
});

// updating URLs
app.post('/urls/:shortURL', (req, res) => {
  const longerURL = req.body.longerURL;
  urlDatabase[req.params.shortURL] = longerURL;
  return res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
  // const longURL = ...
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.status(301).redirect(longURL);
});

// Delete an URL
app.post('/urls/:shortURL/delete', (req, res) => {
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


