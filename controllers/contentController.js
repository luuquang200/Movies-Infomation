const Movie = require("../models/movieModel");

module.exports = {
    // get content for home page
    getContent: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const numberOfPage = 10;
            const movies = await Movie.getTopRatingMovies(numberOfPage, page);
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = movies.length === numberOfPage ? page + 1 : null;
            res.render('home', { layout: 'main', movies, prevPage, nextPage });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};
  