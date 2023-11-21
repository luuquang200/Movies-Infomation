const fs = require('fs');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('../utils/db');
const { Movies, Genres, MovieGenres, Reviews, Synopses, Casts, MovieCasts} = require('../models/models');


module.exports = {
    importData: (req, res) => {
        upload.array('dataFiles')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error uploading files' });
            }

            for (let file of req.files) {
                const data = fs.readFileSync(file.path, 'utf-8');
                const jsonData = JSON.parse(data);
                let moviesData = [];
                let castsData = [];
                if (file.originalname.startsWith('movies')) {
                    moviesData = jsonData;
                } else if (file.originalname.startsWith('casts')) {
                    castsData = jsonData;
                }
                // Import data into tables in the database
                // Movies
                for (let movie of moviesData) {
                    const { id, img, title, year, topRank, rating, ratingCount } = movie;
                    const movieData = { id, img, title, year, topRank, rating, ratingCount };
                    // check if movie exists
                    const movieExists = await Movies.findById(id);
                    if (movieExists) {
                        await Movies.update(movieData);
                    }
                    else{
                        await Movies.insert(movieData);
                    }
                }
                // Genres
                for (let movie of moviesData) {
                    const { genres } = movie;
                    for (let genreName of genres) {
                        // console.log(genreName);
                        // check if genre exists
                        const genreExists = await Genres.getIdByName(genreName);
                        if (genreExists) {
                            continue;
                        }
                        await Genres.insert(genreName);
                    }
                }
                // MovieGenres
                for (let movie of moviesData) {
                    const { id, genres } = movie;
                    for (let genreName of genres) {
                        const genreId = await Genres.getIdByName(genreName);
                        if (genreId) {
                            const movieGenreData = { movieId: id, genreId };
                            await MovieGenres.insert(movieGenreData);
                        }
                    }
                }
                // Reviews
                for (let movie of moviesData) {
                    const { id, reviews } = movie;
                    for (let review of reviews) {
                        const { author, authorRating, helpfulnessScore, interestingVotes = {}, languageCode, reviewText, reviewTitle, submissionDate } = review;
                        const reviewData = { movieId: id, author, authorRating, helpfulnessScore, interestingVotesDown: interestingVotes.down, interestingVotesUp: interestingVotes.up, languageCode, reviewText, reviewTitle, submissionDate };
                        await Reviews.insert(reviewData);
                    }
                }
                // Synopses
                for (let movie of moviesData) {
                    const { id, synopses } = movie;
                    if (synopses) {
                        const { hasProfanity, language, text } = synopses;
                        const synopsisData = { movieId: id, hasProfanity, language, text };
                        await Synopses.insert(synopsisData);
                    }
                }
                // Casts
                for (let cast of castsData) {
                    const { id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknames, realName } = cast;
                    const castData = { id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknames, realName };
                    // check if cast exists
                    const castExists = await Casts.findById(id);
                    if (castExists) {
                        continue;
                    }
                    await Casts.insert(castData);
                }

                // MovieCasts
                for (let movie of moviesData) {
                    const { id, casts } = movie;
                    for (let cast of casts) {
                        const { id: castId, characters } = cast;
                        const castExists = await Casts.findById(castId);
                        if (castExists) {
                            for (let character of characters) {
                                const movieCastData = { movieId: id, castId, character };
                                await MovieCasts.insert(movieCastData);
                            }
                        }
                    }
                }
            }

            res.send('Data imported successfully');
        });
    },

    // get upload page
    getUploadPage: async (req, res) => {
        try {
            res.render('dataImport', { layout: 'main' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
}