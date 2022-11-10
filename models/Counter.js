const db = require('../database/connect');

class Counter {
    constructor({ counter_id, user_id, repo_id, filename }) {
        this.id = counter_id;
        this.userId = user_id;
        this.repoId = repo_id;
        this.filename = filename;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM counter WHERE counter_id = $1', [id]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate counter.');
        } else {
            return new Counter(response.rows[0]);
        }
    }

    static async getAllByRepo(repoId) {
        const response = await db.query('SELECT * FROM counter WHERE repo_id = $1', [repoId]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate counters.');
        } else {
            return response.rows;
        }
    }

    static async create(data) {
        const { repoName, wsId } = data;
        const response = await db.query('INSERT INTO repo (repo_name, workspace_id) VALUES ($1, $2) RETURNING repo_id', [ repoName, wsId ]);

        if (!response.rows[0].repo_id) {
            throw 'Failed to create repo.'
        }
    }

    async destroy() {
        await db.query('DELETE FROM counter WHERE counter_id = $1', [this.id]);
    }
}

module.exports = Counter;
