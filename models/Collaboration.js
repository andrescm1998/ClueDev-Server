const db = require('../database/connect');


class Collaboration {
    // constructor({ collaboration_id, github_username, workspace_id }) {
    //     this.id = collaboration_id;
    //     this.user = github_username;
    //     this.wsId = workspace_id;
    // }

    static async create(data) {
        const { ghUsername, wsId } = data;
        await db.query('INSERT INTO collaboration (github_username, workspace_id) VALUES ($1, $2)', [ghUsername, wsId]);
    }
}

module.exports = Collaboration;
