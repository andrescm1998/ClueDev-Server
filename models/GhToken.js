const db = require('../database/connect');

class GhToken {
    constructor({ github_token_id, github_token, user_id }) {
        this.id = github_token_id;
        this.ghToken = github_token;
        this.userId = user_id;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM github_token WHERE github_token_id = $1', [id]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate token.');
        } else {
            return new GhToken(response.rows[0]);
        }
    }

    static async getOneByUser(userId) {
        const response = await db.query('SELECT * FROM github_token WHERE user_id = $1', [userId]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate token.');
        } else {
            return new GhToken(response.rows[0]);
        }
    }

    static async create(data) {
        const { ghToken, userId } = data;
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
