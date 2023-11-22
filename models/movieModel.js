const db = require('../utils/db');

class Movie {
    constructor({id, img, title, year, topRank, rating, ratingCount}) {
        this.id = id;
        this.img = img;
        this.title = title;
        this.year = year;
        this.topRank = topRank;
        this.rating = rating;
        this.ratingCount = ratingCount;
    }

    static async insert(movie) {
        const { id, img, title, year, topRank, rating, ratingCount } = movie;
        const result = await db.none(
            'INSERT INTO Movies (id, img, title, year, topRank, rating, ratingCount) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, img, title, year, topRank, rating, ratingCount]
        );
        return result;
    }

    static async update(movie) {
        const { id, img, title, year, topRank, rating, ratingCount } = movie;
        const result = await db.none(
            'UPDATE Movies SET img = $1, title = $2, year = $3, topRank = $4, rating = $5, ratingCount = $6 WHERE id = $7',
            [img, title, year, topRank, rating, ratingCount, id]
        );
        return result;
    }

    static async findById(id) {
        const result = await db.oneOrNone('SELECT * FROM Movies WHERE id = $1', [id]);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('Movies');
        return result;
    }


    static async getTopRatingMovies(numberOfPage, page) {
        const offset = (page - 1) * numberOfPage;
        const result = await db.getSortedDataFromTable(numberOfPage, offset, 'Movies', 'rating');
        return result;
    }

    // search movies by title or genre
    static async searchMovies(searchText, numberOfPage, page) {
        const result = await db.searchMovie(searchText, numberOfPage, page);
        return result;
    }

    // get detail of a movie by id
    static async getMovieDetails(id) {
        const result = await db.getMovieDetails(id);
        return result;
    }

    // get reviews of a movie by id
    static async getMovieReviews(id) {
        const result = await db.getMovieReviews(id);
        return result;
    }
}

module.exports = Movie;