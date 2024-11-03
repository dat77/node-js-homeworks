CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    second_name VARCHAR(128)
);
-- Creating a stored procedure
CREATE OR REPLACE PROCEDURE add_student(a_first_name VARCHAR(128), a_second_name VARCHAR(128))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO students (first_name, second_name)
    VALUES (a_first_name, a_second_name);
END;
$$;
-- Calling the stored procedure
CALL add_student('Robert','Plant');
-- See result
SELECT * FROM students;