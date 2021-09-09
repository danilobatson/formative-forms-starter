const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
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
const validateGuest = (req, res, next) => {
	const { firstName, lastName, email, password, confirmedPassword } = req.body;
	const errors = [];

	if (!firstName) {
		errors.push('Please provide a first name.');
	}

  if (!lastName) {
		errors.push('Please provide a last name.');
	}

  if (!email) {
		errors.push('Please provide an email.');
	}

  if (!password) {
		errors.push('Please provide a password.');
	}

  if (password !== confirmedPassword) {
		errors.push('The provided values for the password and password confirmation fields did not match.');
	}

	req.errors = errors;
	next();
};

const validateIntersting = (req, res, next) => {
	const {
		firstName,
		lastName,
		email,
		password,
		confirmedPassword,
		age,
		favoriteBeatle,
		iceCream,
	} = req.body;
	const errors = [];

	if (!firstName) {
		errors.push('Please provide a first name.');
	}

	if (!lastName) {
		errors.push('Please provide a last name.');
	}

	if (!email) {
		errors.push('Please provide an email.');
	}

	if (!password) {
		errors.push('Please provide a password.');
	}

	if (password !== confirmedPassword) {
		errors.push(
			'The provided values for the password and password confirmation fields did not match.'
		);
	}
  if (!age) {
    errors.push(
    'age is required'
    )
  }

  if ((typeof age) !== 'number'){
    errors.push(
      'age must be a valid age'
    )
  }

  if (age < 0 || age > 120) {
    errors.push(
    'age must be a valid age'
    )
  }

  if(!favoriteBeatle) {
    errors.push(
    'favoriteBeatle is required'
    )
  }

  if (favoriteBeatle == 'Scooby-Doo') {
    errors.push(
    'favoriteBeatle must be a real Beatle member'
    )
  }



	req.errors = errors;
	next();
};

app.get("/", async (req, res) => {
  res.render('index', {users})
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('users', {user:{}, csrfToken: req.csrfToken()})
})

app.post('/create', csrfProtection, validateGuest, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  if (req.errors.length > 0) {
    res.render('users', {
			csrfToken: req.csrfToken(),
			user: req.body,
			errors: req.errors,
		});
  }
	else {
    const lastId = users[users.length-1].id
    users.push({
			id: lastId + 1,
			firstName,
			lastName,
			email,
			password,
			confirmedPassword,
		});
    //res.redirect(status, url);
    res.redirect('/')
  }
});

app.get("/create-interesting", csrfProtection, (req, res) => {
	res.render('interesting', {user:{}, csrfToken: req.csrfToken()})
  })

app.post(
	'/create-interesting',
	csrfProtection,
	validateIntersting,
	(req, res) => {
		const {
			firstName,
			lastName,
			email,
			password,
			confirmedPassword,
			age,
			favoriteBeatle,
			iceCream,
		} = req.body;
		if (req.errors.length > 0) {
			res.render('users', {
				csrfToken: req.csrfToken(),
				user: req.body,
				errors: req.errors,
			});
		} else {
			const lastId = users[users.length - 1].id;
			users.push({
				id: lastId + 1,
				firstName,
				lastName,
				email,
				password,
				confirmedPassword,
        age,
        favoriteBeatle,
        iceCream
			});
			//res.redirect(status, url);
			res.redirect('/');
		}
	}
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
