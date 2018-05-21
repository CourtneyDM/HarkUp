DROP DATABASE IF EXISTS HarkUp;

CREATE DATABASE HarkUp;

USE HarkUp;

CREATE TABLE user_info (
user_id INT NOT NULL AUTO_INCREMENT,
full_name varchar (50) NOT NULL,
user_email varchar (50) NOT NULL,
signup_date DATETIME NOT NULL,
PRIMARY KEY (user_id)
);

CREATE TABLE user_preferences (
user_email VARCHAR(50) NOT NULL,
voice_preference INT NOT NULL,
signup_reason VARCHAR(55) NOT NULL,
signup_date DATETIME
);

CREATE TABLE user_articles (
user_email VARCHAR(20),
website_url VARCHAR(55) NOT NULL DEFAULT "",
date_added DATETIME NOT NULL
);