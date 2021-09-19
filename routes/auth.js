const jwt = require("jsonwebtoken");
const db = require("../db.js");
const bcrypt = require("bcrypt")
const Router = require("express").Router;
const router = new Router();
const User = require("../models/user.js")
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require("../expressError.js");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

 router.post("/login", async function(req, res, next) {
    try {
      const { username, password} = req.body;
      const result = await db.query("SELECT password FROM users WHERE username = $1", [username])
      let user = results.rows[0]

      if (user) {
          if (await bcrypt.compare(password, user.password) === true) {
              User.updateLoginTimestamp(username)
              let token = jwt.sign({username}, SECRET_KEY)
              return res.json({ token })
          }
      }
      throw new ExpressError("Invalid user/password", 400) 
    } catch (err) {
      return next(err);
    }
  });


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 router.post("/register", async function(req, res, next) {
    try {
      let { username } = User.register(req.body)
      User.updateLoginTimestamp(username)
      let token = jwt.sign({username}, SECRET_KEY)
      return res.json({ token })
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;