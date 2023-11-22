const Movie = require("../models/movieModel");

module.exports = {
    // get results for search page
    search: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const numberOfPage = 10;
            const searchText = req.query.searchText;
            const result = await Movie.searchMovies(searchText, numberOfPage, page);
            const movies = result.data;
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = movies.length === numberOfPage ? page + 1 : null;
            res.render('resultSearch', { layout: 'main', movies, prevPage, nextPage, searchText });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};
  