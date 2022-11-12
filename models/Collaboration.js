const db = require('../database/connect');


class Collaboration {
    constructor({ collaboration_id, github_username, workspace_id }) {
        this.id = collaboration_id;
        this.user = github_username;
        this.wsId = workspace_id;
    }

    static async create(data) {
        const { ghUsername, wsId } = data;
        await db.query('INSERT INTO collaboration (github_username, workspace_id) VALUES ($1, $2)', [ghUsername, wsId]);
    }

    static async getAllByWorkspace(wsId) {
        const response = await db.query('SELECT u.github_username, u.github_avatar FROM user_account AS u JOIN collaboration AS c ON u.user_id WHERE c.workspace_id = $1', [wsId]);
        if (response.rows.length !== 1) {
            throw new Error('Unable to locate collaborators.');
        } else {
            return response.rows.map(collaboration => new Collaboration(collaboration));
        }
    }
}

module.exports = Collaboration;
