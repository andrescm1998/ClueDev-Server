const db = require('../database/connect');

class Counter {
    constructor({ counter_id, user_id, repo_id, sha }) {
        this.id = counter_id;
        this.userId = user_id;
        this.repoId = repo_id;
        this.sha = sha;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM user_counter WHERE counter_id = $1', [id]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate counter.');
        } else {
            return new Counter(response.rows[0]);
        }
    }

    static async getOneByUser(data) {
        const { userId, sha } = data;
        const response = await db.query('SELECT * FROM user_counter WHERE user_id = $1 AND sha = $2', [userId, sha]);

        if (response.rows.length !== 1) {
            throw new Error('Unable to locate counter.');
        } else {
            return new Counter(response.rows[0]);
        }
    }

    static async getAllByRepo(repoId) {
        const response = await db.query('SELECT * FROM user_counter WHERE repo_id = $1', [repoId]);
        // if (response.rows.length === 0) {
        //     throw new Error('Unable to locate counters.');
        // } else {
        //     return response.rows;
        // }
        return response.rows
    }

    static async create(data) {
        const { userId, repoId, sha } = data;
        const response = await db.query('INSERT INTO user_counter (user_id, repo_id, sha) VALUES ($1, $2, $3) RETURNING counter_id', [ userId, repoId, sha ]);
        const id = response.rows[0].counter_id;
        const counter = await Counter.getOneById(id);
        return counter;
    }

    async destroy() {
        await db.query('DELETE FROM user_counter WHERE counter_id = $1', [this.id]);
    }

    async checkConflicts() {
        const response = await db.query('SELECT * FROM user_counter WHERE sha = $1', [this.sha]);
        return response.rows.length > 1;
    }
}

module.exports = Counter;
