DROP TABLE IF EXISTS collaboration;
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS github_token;
DROP TABLE IF EXISTS user_counter;
DROP TABLE IF EXISTS repo;
DROP TABLE IF EXISTS workspace;
DROP TABLE IF EXISTS user_account;

CREATE TABLE user_account (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    github_username VARCHAR(50) UNIQUE NOT NULL,
    github_avatar VARCHAR(80) UNIQUE NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE token (
    token_id INT GENERATED ALWAYS AS IDENTITY,
    token CHAR(40) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE github_token (
    github_token_id INT GENERATED ALWAYS AS IDENTITY,
    github_token CHAR(40) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (github_token_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE workspace (
    workspace_id INT GENERATED ALWAYS AS IDENTITY,
    workspace_name VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (workspace_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id") ON DELETE CASCADE
);

CREATE TABLE repo (
    repo_id INT GENERATED ALWAYS AS IDENTITY,
    repo_name VARCHAR(50) UNIQUE NOT NULL,
    workspace_id INT NOT NULL,
    PRIMARY KEY (repo_id),
    FOREIGN KEY (workspace_id) REFERENCES workspace("workspace_id") ON DELETE CASCADE
);

CREATE TABLE user_counter (
    counter_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    repo_id INT NOT NULL,
    sha VARCHAR(50) NOT NULL,
    PRIMARY KEY (counter_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id") ON DELETE CASCADE,
    FOREIGN KEY (repo_id) REFERENCES repo("repo_id") ON DELETE CASCADE
);

CREATE TABLE collaboration (
    collaboration_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    PRIMARY KEY (collaboration_id),
    FOREIGN KEY (user_id) REFERENCES user_account ("user_id") ON DELETE CASCADE,
    FOREIGN KEY (workspace_id) REFERENCES workspace ("workspace_id") ON DELETE CASCADE
);

