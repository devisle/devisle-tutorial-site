import MongoClient from "mongodb";

/**
 * Static helper class resposible for handling all DB operations
 * @author ale8k
 */
export default class DbService {
    /**
     * Url of mongodb
     */
    private static _dbUrl = "mongodb://localhost:27017";
    /**
     * DBName
     */
    private static _dbName = "tutorial";

    constructor() {
        console.log("boo from service!");
    }

}
