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
        await db.insertOne('Movies', { id, img, title, year, topRank, rating, ratingCount });
        return id;
    }

}

module.exports = Movie;