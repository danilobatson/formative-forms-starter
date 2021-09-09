const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});;

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.set("view engine", "pug");



const users = [
  {
    id: 1,
    firstName: 'Jill',
    lastName: 'Jack',
    email: 'jill.jack@gmail.com',
  },
];

// const form = [
//   {
//     firstName: 'First Name',
//     lastName: 'Last Name',
//     email: 'Email',
//     password: 'Password',
//     confirmedPassword: 'Confirmed Password'
//   },
// ];


app.get("/", async (req, res) => {
  res.render('index', {users})
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('users', {csrfToken: req.csrfToken()})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
