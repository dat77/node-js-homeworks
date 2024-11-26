CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS tweets (
                                      id SERIAL PRIMARY KEY,
                                      content TEXT NOT NULL,
                                      username VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username)
    );


CREATE TABLE IF NOT EXISTS audit (
                                     id SERIAL PRIMARY KEY,
                                     event_type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );