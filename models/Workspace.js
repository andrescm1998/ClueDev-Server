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

    static async getAllByUsername(userId) {
        const response = await db.query('SELECT w.workspace_id, w.workspace_name, w.user_id FROM workspace AS w JOIN collaboration AS c ON w.workspace_id=c.workspace_id WHERE c.user_id = $1 GROUP BY w.workspace_id', [userId]);

        if (response.rows.length === 0) {
            throw new Error('Unable to locate workspaces.');
        } else {
            return response.rows.map(workspace => new Workspace(workspace))
        }
    }

    static async create(data) {
        const { wsName, userId } = data;
        const response = await db.query('INSERT INTO workspace (workspace_name, user_id) VALUES ($1, $2) RETURNING workspace_id', [wsName, userId]);

        const id = response.rows[0].workspace_id;
        const workspace = await Workspace.getOneById(id);
        return workspace;
    }

    async destroy() {
        await db.query('DELETE FROM workspace WHERE workspace_id = $1', [this.id]);
    }

    async update(wsName) {
        await db.query('UPDATE workspace SET workspace_name = $1, user_id = $2 WHERE workspace_id = $3', [wsName, this.creator, this.id]);
    }
}

module.exports = Workspace;
