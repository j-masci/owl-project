CREATE TABLE IF NOT EXISTS users (
    id integer primary key,
    username varchar(255) unique not null,
    first_name varchar(255) default '',
    last_name varchar(255) default '',
    date_of_birth INT default ''
);
