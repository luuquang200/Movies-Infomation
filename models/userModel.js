const db = require('../utils/db');

class User {
  constructor({id, username, password, email, name }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.name = name;
  }

  static async insert(user) {
    // Remove the id property from the user object
    const { id, ...userWithoutId } = user;

    // Insert the user without the id into the database
    const result = await db.insertUser(userWithoutId);
    user.id = result.id;

    return user;
  }

  static async findByUsername(username) {
    return db.getUserByUserName(username);
  }

  static async findByEmail(email) {
    return db.getUserByEmail(email);
  }
}

module.exports = User;