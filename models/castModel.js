const db = require('../utils/db');

class Cast {
    static async getDetails(id) {
        const result = await db.getCastDetails(id);
        return result;
    }

    static async insert(cast) {
        let { id, image, legacyNameText, name, birthDate, birthPlace, gender, heightCentimeters, nicknames = [], realName } = cast;
        const nicknamesStr = nicknames.join(','); // convert array to string
        // Check if birthDate is in the correct format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(birthDate)) {
            birthDate = null; // or set to a default value
        }

        const castData = {
            id,
            image,
            legacyNameText,
            name,
            birthDate,
            birthPlace,
            gender,
            heightCentimeters,
            nicknames: nicknamesStr,
            realName
        };

        const result = await db.insertOne('casts', castData);
        return result;
    }

    static async deleteAll() {
        const result = await db.deleteAll('Casts');
        return result;
    }
}

module.exports = Cast;