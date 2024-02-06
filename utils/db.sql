CREATE TABLE Movies (
    id VARCHAR(255) PRIMARY KEY,
    img TEXT,
    title TEXT,
    year INTEGER,
    topRank INTEGER,
    rating FLOAT,
    ratingCount INTEGER
);

CREATE TABLE Genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE MovieGenres (
    movieId VARCHAR(255),
    genreId INTEGER,
    FOREIGN KEY (movieId) REFERENCES Movies(id),
    FOREIGN KEY (genreId) REFERENCES Genres(id)
);

CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    movieId VARCHAR(255),
    author TEXT,
    authorRating INTEGER,
    helpfulnessScore FLOAT,
    interestingVotesDown INTEGER,
    interestingVotesUp INTEGER,
    languageCode VARCHAR(255),
    reviewText TEXT,
    reviewTitle TEXT,
    submissionDate DATE,
    FOREIGN KEY (movieId) REFERENCES Movies(id)
);

CREATE TABLE Synopses (
    id SERIAL PRIMARY KEY,
    movieId VARCHAR(255),
    hasProfanity BOOLEAN,
    language VARCHAR(255),
    text TEXT,
    FOREIGN KEY (movieId) REFERENCES Movies(id)
);

CREATE TABLE Casts (
    id VARCHAR(255) PRIMARY KEY,
    image TEXT,
    legacyNameText TEXT,
    name TEXT,
    birthDate DATE,
    birthPlace TEXT,
    gender VARCHAR(255),
    heightCentimeters FLOAT,
    nicknames TEXT,
    realName TEXT
);

CREATE TABLE MovieCasts (
    movieId VARCHAR(255),
    castId VARCHAR(255),
    character TEXT,
    FOREIGN KEY (movieId) REFERENCES Movies(id),
    FOREIGN KEY (castId) REFERENCES Casts(id)
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sessionId VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

CREATE TABLE Favorites (
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    movieId VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (movieId) REFERENCES Movies(id)
);