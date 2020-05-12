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

    /**
     * Creates a document within a given collection
     * @param {string} collectionName collection name
     * @param {Object} data any object type to be parsed and created as a document
     */
    public static async createDocument(collectionName: string, data: Object): Promise<void> {
        await MongoClient.connect(DbService._dbUrl, (err, client) => {
            if (err) {
                throw new Error("DB connection failed" + err);
            }
            console.log("Connected successfully to db");
            const db = client.db(DbService._dbName);
            db.collection(collectionName).insertOne(data, (error, resp) => {
                console.log(resp);
            });

            client.close().then(() => {
                console.log("connection closed successfully");
            });
        });
    }

}
