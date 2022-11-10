const db = require('../database/connect');

class User {

    constructor({ user_id, github_username }) {
        this.id = user_id;
        this.ghUsername = github_username;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM user_account WHERE user_id = $1', [id]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate user.');
        } else {
            return new User(response.rows[0]);
        }
    }

    static async getOneByUsername(ghUsername) {
        const response = await db.query('SELECT * FROM user_account WHERE github_username = $1', [ghUsername]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate user.');
        } else {
            return new User(response.rows[0]);
        }
    }

    static async create(data) {
        const { ghUsername } = data;
        const response = await db.query('INSERT INTO user_account (github_username) VALUES ($1) RETURNING user_id', [ghUsername]);
        const id = response.rows[0].user_id;
        const user = await User.getOneById(id);
        return user;
    }
}

module.exports = User;
