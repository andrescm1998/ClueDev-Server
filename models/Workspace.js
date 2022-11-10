const db = require('../database/connect');

class Workspace {
    constructor({ workspace_id, workspace_name, user_id }) {
        this.id = workspace_id;
        this.name = workspace_name;
        this.creator = user_id;
    }

    static async getOneById(id) {
        const response = await db.query('SELECT * FROM workspace WHERE workspace_id = $1', [id]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate workspace.');
        } else {
            return new Workspace(response.rows[0]);
        }
    }

    static async getOneByName(name) {
        const response = await db.query('SELECT * FROM workspace WHERE workspace_name = $1', [name]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate workspace.');
        } else {
            return new Workspace(response.rows[0]);
        }
    }

    static async getAllByUsername(ghUsername) {
        const response = await db.query('SELECT w.workspace_id, w.workspace_name, w.user_id FROM workspace AS w JOIN collaboration AS c ON w.workspace_id WHERE ghUsername = $1', [ghUsername]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate workspaces.');
        } else {
            return response.rows.map(workspace => new Workspace(workspace))
        }
    }

    static async create(data) {
        const { wsName, userId } = data;
        const response = await db.query('INSERT INTO workspace (workspace_name, user_id) VALUES ($1, $2) RETURNING workspace_id', [wsName, userId]);

        if (!response.rows[0].workspace_id) {
            throw 'Failed to create repo.'
        }
    }

    async destroy() {
        await db.query('DELETE FROM workspace WHERE workspace_id = $1', [this.id]);
    }
}

module.exports = Workspace;
