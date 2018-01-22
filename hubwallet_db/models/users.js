const bcrypt = require('bcryptjs'),
      db = require('../db/config')

const User = {
  // define a recursive method to generate a token
  // we need to generate a random string that is unique to our database
  // and nearly impossible to replicate
  generateToken: (callback, ...params) => {
    // generate a random number and hash it to create a token
    const token = bcrypt.hashSync(Math.random().toString(), 10);
    // this is returning a promise to make sure the token does not already
    // exist in our database
    return db.oneOrNone('SELECT id FROM users WHERE token = $1', [token])
      .then((res) => { // once we get the response
        if(res){ // if there is a user with that token
          // redo this function and return the result
          return generateToken();
        }
        return callback(...params, token);
      })
  },

  // method to update the token on a user
  // this will be called each time the user logs in
  updateToken: (id, token) => {
    return db.one(`UPDATE users SET token = $1
      WHERE id = $2 RETURNING first_name, last_name, email, token, id`, [token, id]);
  },
  //returns promise that is being created with db.one
  // 'then' clause in sessions controller

  // model method to create a user
  create: (first_name, last_name, email, password, token) => {
    // encrypt the password using bcrypt
    const password_digest = bcrypt.hashSync(password, 10);
    // insert the user into the database
    return db.one(`INSERT INTO users
      (first_name, last_name, email, password_digest, token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING first_name, last_name, email, token, id`, // the information we want to send back
      [first_name, last_name, email, password_digest, token])
  },

  // method to find a user given a email
  findByEmail: (email) => db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]),
  //this method returns a promise
  // method to find a user given a token
  // it is using db.one so that if there is not a user, it will throw an error
  // we will handle that error in the .catch()
  findByToken: (token) => db.one('SELECT * FROM users WHERE token = $1', [token])
}

module.exports = User;
