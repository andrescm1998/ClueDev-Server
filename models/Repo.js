const db = require('../database/connect');

class Repo {
    constructor({ repo_id, repo_name, workspace_id, owner_id }) {
        this.id = repo_id;
        this.name = repo_name;
        this.wsId = workspace_id;
        this.ownerId = owner_id;
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

    static async getAllByWorkspace(wsId) {
        const response = await db.query('SELECT * FROM repo WHERE workspace_id = $1', [wsId]);
        if (response.rows.length === 0) {
            throw new Error('Unable to locate repo.');
        } else {
            return response.rows.map(repo => new Repo(repo));
        }
    }

    static async create(data) {
        const { repoName, wsId, ownerId } = data;
        const response = await db.query('INSERT INTO repo (repo_name, workspace_id, owner_id) VALUES ($1, $2, $3) RETURNING repo_id', [ repoName, wsId, ownerId ]);
        const id = response.rows[0].repo_id;
        const repo = await Repo.getOneById(id);
        return repo;
    }

    async destroy() {
        await db.query('DELETE FROM repo WHERE repo_id = $1', [this.id]);
    }
}

module.exports = Repo;
