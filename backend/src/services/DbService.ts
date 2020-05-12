import MongoClient from "mongodb";
import ITutorial from "src/controllers/interfaces/ITutorial";

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
     * Creates a tutorial document within a given collection
     * @param {string} collectionName collection name
     * @param {ITutorial} tutorial any object type to be parsed and created as a document
     * @return {Promise<boolean>} a promise from the {@link createDoc DbService.createDocument<T>}
     * determining if the document inserted correctly
     */
    public static async createTutorialDocument(collectionName: string, tutorial: ITutorial): Promise<boolean> {
        return DbService.createDocument<ITutorial>(collectionName, tutorial);
    }

    /**
     * Creates a document within a given collection
     * @param {string} collectionName collection name
     * @param {T} data any object type to be parsed and created as a document
     * @return {Promise<boolean>} a promise determining if the document inserted correctly
     */
    private static async createDocument<T>(collectionName: string, data: T): Promise<boolean> {
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
            (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
        return new Promise((resolve, reject) => {
            response ? resolve() : reject();
        });
    }

}
