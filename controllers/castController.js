const Cast = require('../models/castModel');

module.exports = {
    // get details for cast page
    getDetails: async (req, res) => {
        try {
            const castId = req.params.id;
            const details = await Cast.getDetails(castId);
            const cast = details.cast;
            console.log(cast);
            const movies = details.movies;
            res.render('castDetail', { layout: 'main', cast, movies});
          
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

};