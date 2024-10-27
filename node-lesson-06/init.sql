CREATE TABLE IF NOT EXISTS author(
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS album(
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL,
	name VARCHAR(128) NOT NULL,
    FOREIGN_KEY(author_id)
       REFERENCES author(id)
       ON DELETE CASCADE
);

INSERT INTO author (name)
VALUES
    ('Led Zeppelin'),
    ('Nirvana');

INSERT INTO album (author_id, name)
VALUES
    ('Led Zeppelin II', 1),
	('Led Zeppelin IV', 1),
    ('Nevermind', 2),
	('In Utero', 2);

-- DELETE FROM author
-- WHERE id = 1;