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
            const reviews = await Movie.getMovieReviews(movieId);
            // console.log(reviews);
            // console.log(details);
            res.render('movieDetail', { layout: 'main', movie, genres, casts, synopsis, reviews });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};
  