DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS user_counter;
DROP TABLE IF EXISTS workspace;
DROP TABLE IF EXISTS repo;
DROP TABLE IF EXISTS user_account;

CREATE TABLE user_account (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    github_username VARCHAR(50) UNIQUE NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE token (
    token_id INT GENERATED ALWAYS AS IDENTITY,
    token CHAR(40) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (token_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE workspace (
    workspace_id INT GENERATED ALWAYS AS IDENTITY,
    workspace_name VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (workspace_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id")
);

CREATE TABLE repo (
    repo_id INT GENERATED ALWAYS AS IDENTITY,
    repo_name VARCHAR(50) UNIQUE NOT NULL,
    workspace_id INT NOT NULL,
    PRIMARY KEY (repo_id),
    FOREIGN KEY (workspace_id) REFERENCES workspace("workspace_id")
);

CREATE TABLE user_counter (
    counter_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    repo_id INT NOT NULL,
    PRIMARY KEY (counter_id),
    FOREIGN KEY (user_id) REFERENCES user_account("user_id"),
    FOREIGN KEY (repo_id) REFERENCES repo("repo_id")
);

