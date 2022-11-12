const db = require('../database/connect');


class Collaboration {
    // constructor({ collaboration_id, user_id, workspace_id }) {
    //     this.id = collaboration_id;
    //     this.user = user_id;
    //     this.wsId = workspace_id;
    // }

    static async create(data) {
        const { userId, wsId, repoId } = data;
        await db.query('INSERT INTO collaboration (user_id, workspace_id, repo_id) VALUES ($1, $2, $3)', [userId, wsId, repoId]);
    }
}

module.exports = Collaboration;
