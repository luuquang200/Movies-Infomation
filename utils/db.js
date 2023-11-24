require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true,
});

const dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPW,
  max: 30,
};

const db = pgp(dbConfig);

async function testDatabaseConnection() {
    try {
        await db.any('SELECT 1');
        console.log('Connected to the database successfully!');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}



module.exports = {
    testDatabaseConnection,

    // Get all records from a table
    getAll: async (tbName) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.any(`SELECT * FROM ${tbName}`);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // insert a record into a table
    insertOne: async (tbName, data) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const keys = Object.keys(data);
            const values = Object.values(data);
            const sql = `INSERT INTO ${tbName} (${keys.join(', ')}) VALUES (${keys.map((key, index) => '$' + (index + 1)).join(', ')})`;
            await databaseConnection.none(sql, values);
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // update a record in a table by id
    updateOne: async (tbName, id, property, value) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const sql = `UPDATE ${tbName} SET ${property} = $1 WHERE id = $2`;
            await databaseConnection.none(sql, [value, id]);
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // insert a user into the users table
    insertUser: async (data) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const keys = Object.keys(data);
            const values = Object.values(data);
            const sql = `INSERT INTO users (${keys.join(', ')}) VALUES (${keys.map((key, index) => '$' + (index + 1)).join(', ')}) RETURNING id`;
            const result = await databaseConnection.one(sql, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },


    // get user by login name 
    getUserByUserName: async (username) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username]);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get user by email
    getUserByEmail: async (email) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.oneOrNone(`SELECT * FROM users WHERE email = $1`, [email]);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get user by session id
    getUserBySessionId: async (sessionId) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.oneOrNone(`SELECT * FROM users WHERE sessionId = $1`, [sessionId]);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get favorites movie by user id
    getFavoriteMovies: async (userId) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const sql = `SELECT movies.* FROM movies JOIN favorites ON movies.id = favorites.movieId WHERE favorites.userId = $1`;
            const favoriteMovies = await databaseConnection.any(sql, [userId]);
            return favoriteMovies;
        } catch (error) {
            throw error;
        } finally { 
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },
    
   
    none: async (sql, values) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            await databaseConnection.none(sql, values);
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    //oneOrNone
    oneOrNone: async (sql, values) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.oneOrNone(sql, values);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // delete all records in a table
    deleteAll: async (tbName) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            await databaseConnection.none(`DELETE FROM ${tbName}`);
            return true;
        } catch (error) {
            throw error;
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },
    
    
    // get top n record with offset from a table
    getSortedDataFromTable: async (limit, offset, tbName, sortingCriteria) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const data = await databaseConnection.any(`SELECT * FROM ${tbName} WHERE rating IS NOT NULL ORDER BY ${sortingCriteria} DESC LIMIT $1 OFFSET $2`, [limit, offset]);
            return data;
        } catch (error) {
            console.error(`Error getting sorted data from ${tbName}:`, error);
            throw new Error(`Could not get sorted data from ${tbName}`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // search for a movie by title or genre
    searchMovie: async (searchTerm, per_page, page) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const offset = (page - 1) * per_page;

            const total = await databaseConnection.one(`
                SELECT COUNT(DISTINCT movies.id) 
                FROM movies 
                LEFT JOIN moviegenres ON movies.id = moviegenres.movieId
                LEFT JOIN genres ON moviegenres.genreId = genres.id
                WHERE movies.title ILIKE $1 OR genres.name ILIKE $1
            `, [`%${searchTerm}%`]);

            const data = await databaseConnection.any(`
                SELECT movies.*, array_agg(genres.name) as genres 
                FROM movies 
                LEFT JOIN moviegenres ON movies.id = moviegenres.movieId
                LEFT JOIN genres ON moviegenres.genreId = genres.id
                WHERE movies.id IN (
                    SELECT movies.id 
                    FROM movies 
                    LEFT JOIN moviegenres ON movies.id = moviegenres.movieId
                    LEFT JOIN genres ON moviegenres.genreId = genres.id
                    WHERE movies.title ILIKE $1 OR genres.name ILIKE $1 
                )
                GROUP BY movies.id
                LIMIT $2 OFFSET $3
            `, [`%${searchTerm}%`, per_page, offset]);  
            
            return {
                page: page,
                per_page: per_page,
                total: total.count,
                total_pages: Math.ceil(total.count / per_page),
                data: data
            };
        } catch (error) {
            console.error(`Error searching for movie:`, error);
            throw new Error(`Could not search for movie`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get details for a movie
    getMovieDetails: async (id) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const movie = await databaseConnection.oneOrNone(`SELECT * FROM movies WHERE id = $1`, [id]);
            const genres = await databaseConnection.any(`SELECT genres.name FROM genres LEFT JOIN moviegenres ON genres.id = moviegenres.genreId WHERE moviegenres.movieId = $1`, [id]);
            const casts = await databaseConnection.any(`SELECT DISTINCT casts.* FROM casts LEFT JOIN moviecasts ON casts.id = moviecasts.castId WHERE moviecasts.movieId = $1`, [id]);
            const synopsis = await databaseConnection.oneOrNone(`SELECT text FROM synopses WHERE movieId = $1 LIMIT 1`, [id]);
            return {
                movie: movie,
                genres: genres,
                casts: casts,
                synopsis: synopsis
            };
        } catch (error) {
            console.error(`Error getting details for movie:`, error);
            throw new Error(`Could not get details for movie`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get reviews for a movie
    getAllMovieReviews: async (id) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const reviews = await databaseConnection.any(`SELECT * FROM reviews WHERE movieId = $1`, [id]);
            return reviews;
        } catch (error) {
            console.error(`Error getting reviews for movie:`, error);
            throw new Error(`Could not get reviews for movie`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    // get reviews for a movie
    getMovieReviews: async (id,  per_page, page) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const offset = (page - 1) * per_page;

            const total = await databaseConnection.one(`
                SELECT COUNT(DISTINCT reviews.id) 
                FROM reviews 
                WHERE reviews.movieId = $1
            `, [id]);

            const reviews = await databaseConnection.any(`
                SELECT * 
                FROM reviews 
                WHERE movieId = $1
                LIMIT $2 OFFSET $3
            `, [id, per_page, offset]);

            // console.log(reviews);

            return {
                page: page,
                per_page: per_page,
                total: Number(total.count),
                total_pages: Math.ceil(total.count / per_page),
                data: reviews
            };
        } catch (error) {
            console.error(`Error getting reviews for movie:`, error);
            throw new Error(`Could not get reviews for movie`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },

    //get cast by id
    getCastDetails: async (id) => {
        let databaseConnection = null;
        try {
            databaseConnection = await db.connect();
            const cast = await databaseConnection.oneOrNone(`SELECT * FROM casts WHERE id = $1`, [id]);
            const movies = await databaseConnection.any(`SELECT DISTINCT movies.* FROM movies LEFT JOIN moviecasts ON movies.id = moviecasts.movieId WHERE moviecasts.castId = $1`, [id]);
            return {
                cast: cast,
                movies: movies
            };
        } catch (error) {
            console.error(`Error getting details for cast:`, error);
            throw new Error(`Could not get details for cast`);
        } finally {
            if (databaseConnection) {
                databaseConnection.done();
            }
        }
    },




};
