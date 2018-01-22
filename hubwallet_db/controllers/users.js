const User = require('../models/users'),
      router = require('express').Router(),
      Auth = require('../services/auth');

// route that validates the user
// basically a way to ping the server to make sure the token cookie is correct
// and to get the user's information
// We use the Auth.restrict to restrict it to only calls using the auth_token
router.get('/validate', Auth.restrict, (req, res)=>{
  res.json({
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    token: req.user.token,
    id: req.user.id
  })
})

router.post('/', (req, res) => {

  const email = req.body.email.toLowerCase();
  // this is an easier way of doing:
  // const name = req.body.name,
  //       password = req.body.password,
  //       password_confirmation = req.body.password_confirmation;
  const {first_name, last_name, password, password_confirmation} = req.body;


  //////////////////////////////////////////////////////
  // We are going to validate our inputs!
  // creating an object to hold any errors we may find
  const errors = {
    first_name: [],
    last_name: [],
    email: [],
    password: [],
    password_confirmation: []
  };

  // bool to say if there are any errors yet
  let error = false;

  // We want all of these fields to be present so lets iterate through
  // them and make sure the request contains each
  Object.keys(errors).forEach(key => {
    // If it does not have the field
    // the split and join is so we take out any spaces.
    // this will make sure someone doesn't enter just spaces for one of the fields
    if(!req.body[key].split(' ').join('')){
      // add a message to the error object for that field
      // (the split and join here is so we can get rid of the _ in password_confirmation)
      errors[key].push(`${key.split('_').join(' ')} is required`);
      error = true;
    }
  })

  // make sure the password matches the confirmation
  if(password !== password_confirmation){
    errors.password_confirmation.push("Password does not match confirmation.");
    error = true;
  }

  // make sure the email is a valid email address using regex!
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!re.test(email)){
    errors.email.push("Not a valid email address.");
    error = true;
  }
  // end of validation
  //////////////////////////////////////////////////////

  // if there are no errors, create the user!
  if(!error){
    User
      .generateToken(User.create, first_name, last_name, email, password)
      .then(data => { // once we create the user
        res.json(data)
      })
      .catch(err => console.log(err))
  } else { // if there are errors from our validations
    // send back a 400 (bad request) status with the errors
    res.status(400).json({errors: errors})
  }
});

module.exports = router;
