import database from "../config/database.js";

const User = {
  /**
   *  Create new user
   * @param {string} name
   * @param {string} email
   * @param {string} hashedPassword
   * @returns {Promise<any>}
   */

  createUser: (name, email, hashedPassword) => {
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
      database.query(query, [name, email, hashedPassword], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  },

  /**
   * Find User by email
   * @param {string} email
   * @returns {Promise<any>}
   */
  findUserByEmail: (email) => {
    const query = "SELECT * FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
      database.query(query, [email], (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result.length > 0) {
          resolve(result[0]);
        } else {
          resolve(null);
        }
      });
    });
  },
};

export default User;
