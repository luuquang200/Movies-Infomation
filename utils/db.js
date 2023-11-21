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



};
