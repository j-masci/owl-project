CREATE TABLE IF NOT EXISTS users (
    id integer primary key,
    first_name varchar(255) default null,
    last_name varchar(255) default null,
    date_of_birth INT default null
);
