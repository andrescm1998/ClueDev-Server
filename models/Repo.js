const db = require('../database/connect');

class Repo {
    constructor({ repoId, repoName, wsId }) {
        this.id = repoId;
        this.name = repoName;
        this.wsId = wsId;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM repo WHERE repo_id = $1', [id]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate repo.');
        } else {
            return new Repo(response.rows[0]);
        }
    }

    static async getOneByName(name) {
        const response = await db.query('SELECT * FROM repo WHERE repo_name = $1', [name]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate repo.');
        } else {
            return new Repo(response.rows[0]);
        }
    }

    static async create(data) {
        const { repoName, wsId } = data;
        const response = await db.query('INSERT INTO repo (repo_name, workspace_id) VALUES ($1, $2) RETURNING repo_id', [ repoName, wsId ]);
        const id = response.rows[0].repo_id;
        const repo = await Repo.getOneById(id);
        return repo;
    }

    async destroy() {
        await db.query('DELETE FROM repo WHERE repo_id = $1', [this.id]);
    }
}

module.exports = Repo;
