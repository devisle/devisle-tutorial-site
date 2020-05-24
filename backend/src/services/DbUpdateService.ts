import { MongoError, UpdateWriteOpResult, Db } from "mongodb";

/**
 * Static helper class resposible for handling all DB operations/transactions
 *
 * @class
 * @author ale8k, rakeshshubhu
 */
export default class DbUpdateService {
    /**
     * Single DB ref from Server
     */
    public static db: Db;

    /**
     * Gets all documents in a collection of type
     *
     * @async
     * @param {string} collectionName collection name
     * @returns {Promise<T[]>} an array of the given documents
     */
    public static getAllDocuments<T>(collectionName: string): Promise<T[]> {
        return new Promise((res, rej) => {
            DbUpdateService.db.collection<T>(collectionName).find({}).toArray((err, result) => {
                result.length ? res(result) : rej(err);
            });
        });
    }

    /**
     * Creates a document within a given collection
     *
     * @async
     * @param {string} collectionName collection name
     * @param {T} data any object type to be parsed and created as a document
     * @returns {Promise<MongoUpdateResponse>} the base response for an update in mongo
     */
    public static createDocument<T>(collectionName: string, data: T): Promise<MongoUpdateResponse> {
        return new Promise((res, rej) => {
            DbUpdateService.db.collection(collectionName).insertOne(data).then(
                ({ result }) => result.ok ? res() : rej(),
                () => rej()
            );
        });
    }

    /**
     * Updates a single document in a given collection
     *
     * @async
     * @param {string} collectionName collection name
     * @param {T} data the data to write over
     * @returns {Promise<UpdateWriteOpResult>} the mongo result object
     */
    public static updateSingleDocument(collectionName: string, predicate: object, newValue: object): Promise<UpdateWriteOpResult> {
        return new Promise((res, rej) => {
            DbUpdateService.db.collection(collectionName).updateOne(
                predicate,
                newValue,
                (err: MongoError, response: UpdateWriteOpResult) => {
                    err ? rej(err) : res(response);
                }
            );
        });
    }

}
