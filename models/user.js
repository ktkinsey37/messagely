/** User class for message.ly */

const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    let hashedPassword = await bcrypt.hash(password, 12)
    let current = datetime.now()
    let res = await db.query(
      "INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) RETURNING username, password, first_name, last_name, phone",  [username, hashedPassword, first_name, last_name, phone])
      return res.rows[0];
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    let hashedPassword = await bcrypt.hash(password, 12)
    let res = await db.query("SELECT password FROM users WHERE username = $1", username)
    let user = res.row[0]
    if (!user){
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    if (user.password != hashedPassword){
      return False
    }
    return True
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    let res = await db.query("SELECT * FROM users WHERE username = $1", username)
    let user = res.row[0]
    if (!user){
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    let res = await db.query("INSERT INTO users (last_login_at) VALUES (current_timestamp) WHERE username = $1 RETURNING (username, last_login_at)", [username])


   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;