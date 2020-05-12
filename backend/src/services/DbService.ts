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
     * @param {T} data any object type to be parsed and created as a document
     * @return {Promise<boolean>} a promise determining if the document inserted correctly
     */
    public static async createDocument<T>(collectionName: string, data: T): Promise<boolean> {
        let response: boolean = false;
        await MongoClient.connect(DbService._dbUrl).then(
            async (client) => {
                console.log("Connected successfully to db");
                const db = client.db(DbService._dbName);
                await db.collection(collectionName).insertOne(data).then(() => {
                    response = true;
                });
                client.close().then(() => {
                    console.log("connection closed successfully");
                });
            },
            async (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
        return new Promise((resolve, reject) => {
            response ? resolve() : reject();
        });
    }

    /**
     * Gets all documents in a collection of type
     * @param {string} collectionName collection name
     */
    public static async getAllDocuments<T>(collectionName: string): Promise<T[]> {
        let response: T[] = [];
        await MongoClient.connect(DbService._dbUrl).then(
            async (client) => {
                const db = client.db(DbService._dbName);
                await db.collection(collectionName).find({}).toArray(
                    (err, docs: T[]) => {
                        if (err) {
                            throw new Error("Failed to get docs" + err);
                        } else {
                            response = docs;
                        }
                    }
                );
            },
            async (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
        return Promise.resolve(response);
    }

}
