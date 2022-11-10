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

    static async create(data) {
        const { token, userId } = data;
        const response = await db.query('INSERT INTO github_token (github_token, user_id) VALUES ($1, $2) RETURNING github_token_id', [ ghToken, userId ]);
        const id = response.rows[0].github_token_id;
        const token = await GhToken.getOneById(id);
        return token;
    }

    async destroy() {
        await db.query('DELETE FROM github_token WHERE github_token_id = $1', [this.id]);
    }
}

module.exports = GhToken;
