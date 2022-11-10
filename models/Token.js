const { v4: uuidv4 } = require("uuid");
const db = require('../database/connect');


class Token {
    constructor({ token_id, token, user_id }) {
        this.id = token_id;
        this.ghToken = token;
        this.userId = user_id;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM token WHERE token_id = $1', [id]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate token.');
        } else {
            return new Token(response.rows[0]);
        }
    }

    static async getOneByToken(token) {
        const response = await db.query("SELECT * FROM token WHERE token = $1", [token]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate token.");
        } else {
            return new Token(response.rows[0]);
        }
    }

    static async create(userId) {
        const token = uuidv4();
        const response = await db.query('INSERT INTO token (token, user_id) VALUES ($1, $2) RETURNING token_id', [ token, userId ]);
        const id = response.rows[0].github_token_id;
        const newToken = await Token.getOneById(id);
        return newToken;
    }

    async destroy() {
        await db.query('DELETE FROM github_token WHERE github_token_id = $1', [this.id]);
    }
}

module.exports = Token;
