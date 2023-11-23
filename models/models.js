const db = require('../utils/db');


class Genres {
    static async findByName(name) {
        // Implementation here...
        const result = await db.oneOrNone('SELECT * FROM Genres WHERE name = $1', [name]);
        return result;
    }

    static async insert(genreName) {
        // Implementation here...
        const result = await db.none('INSERT INTO Genres (name) VALUES ($1)', [genreName]);
        return result;
    }

    // get id by name
    static async getIdByName(name) {
        const result = await db.oneOrNone('SELECT id FROM Genres WHERE name = $1', [name]);
        if (result) {
            return result.id;
        } else {
            return null;
        }
    }

    static async deleteAll() {
        const result = await db.deleteAll('Genres');
        return result;
    }
}

class MovieGenres {
    static async insert(movieGenre) {
        // Implementation here...
        const { movieId, genreId } = movieGenre;
        const result = await db.none('INSERT INTO MovieGenres (movieId, genreId) VALUES ($1, $2)', [movieId, genreId]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('MovieGenres');
        return result;
    }
}

class Reviews {
    static async insert(review) {
        const { movieId, author, authorRating, helpfulnessScore, interestingVotesDown, interestingVotesUp, languageCode, reviewText, reviewTitle, submissionDate } = review;
        const result = await db.none('INSERT INTO Reviews (movieId, author, authorRating, helpfulnessScore, interestingVotesDown, interestingVotesUp, languageCode, reviewText, reviewTitle, submissionDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [movieId, author, authorRating, helpfulnessScore, interestingVotesDown, interestingVotesUp, languageCode, reviewText, reviewTitle, submissionDate]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('Reviews');
        return result;
    }
}

class Synopses {
    static async insert(synopsis) {
        const { movieId, hasProfanity, language, text } = synopsis;
        const result = await db.none('INSERT INTO Synopses (movieId, hasProfanity, language, text) VALUES ($1, $2, $3, $4)', [movieId, hasProfanity, language, text]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('Synopses');
        return result;
    }
}

class Casts {
    static async findById(id) {
        const result = await db.oneOrNone('SELECT * FROM Casts WHERE id = $1', [id]);
        return result;
    }

    static async insert(cast) {
        let { id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknames = [], realName } = cast;
        const nicknamesStr = nicknames.join(','); // convert array to string
        // Check if birthDate is in the correct format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(birthDate)) {
            birthDate = null; // or set to a default value
        }
        const result = await db.none('INSERT INTO Casts (id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknames, realName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknamesStr, realName]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('Casts');
        return result;
    }
}

class MovieCasts {
    static async insert(movieCast) {
        const { movieId, castId, character } = movieCast;
        const result = await db.none('INSERT INTO MovieCasts (movieId, castId, character) VALUES ($1, $2, $3)', [movieId, castId, character]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('MovieCasts');
        return result;
    }
}

module.exports = { Genres, MovieGenres, Reviews, Synopses, Casts, MovieCasts };