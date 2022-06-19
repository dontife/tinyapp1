const express = require('express');
const cookieParser = require('cookie-parser');
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
// generating a random unique number
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

app.get('/', (req, res) => {
  res.send('Hello!');
});
app.get('/urls.json', (req, res) => {e
  // sends a JSON response
  res.json(urlDatabase);
});
app.get('/urls', (req, res) => {
  const templateVars = { urls : urlDatabase,  username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
    // ... any other vars
  };
  res.render('urls_new', templateVars);
});
// endpoint to create a new account 
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render('register', templateVars);
})
app.post('/urls', (req,res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  // redirect after submission
  res.redirect(`/urls/${shortURL}`);
});
// login route to cookies
app.post('/login', (req,res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');

});
// logout route
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL],  username: req.cookies["username"]};
  res.render('urls_show', templateVars);
});

// updating URLs
app.post('/urls/:shortURL', (req, res) => {
  const longerURL = req.body.longerURL;
  urlDatabase[req.params.shortURL] = longerURL;
  return res.redirect('/urls');
})

app.get('/u/:shortURL', (req, res) => {
  // const longURL = ...
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] ;
 res.status(301).redirect(longURL);
});

// Delete an URL
app.post('/urls/:shortURL/delete', (req, res) => {
  let shortDel = req.params.shortURL;
  delete urlDatabase[shortDel];
  return res.redirect('/urls');
})

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


