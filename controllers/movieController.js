const Movie = require("../models/movieModel");

module.exports = {
    // get details for movie page
    getDetails: async (req, res) => {
        try {
            const movieId = req.params.id;
            const details = await Movie.getMovieDetails(movieId);
            const movie = details.movie;
            const genres = details.genres;
            const casts = details.casts;
            const synopsis = details.synopsis;
            const page = 1;
            const getReviews = await Movie.getMovieReviews(movieId, 10, page);
            const reviews = getReviews.data;
            const totalPagesReviews = getReviews.total_pages;
            const pagesReviews = Array.from({length: totalPagesReviews}, (_, i) => i + 1);
            res.render('movieDetail', { layout: 'main', movie, genres, casts, synopsis, reviews, totalPagesReviews, pagesReviews, page});
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    // get reviews for movie page with pagination
    getReviews: async (req, res) => {
        try {
            const movieId = req.params.id;
            const page = req.query.page || 1;
            const limit = 10; 
            const reviews = await Movie.getMovieReviews(movieId, limit, page);
            res.json(reviews);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};