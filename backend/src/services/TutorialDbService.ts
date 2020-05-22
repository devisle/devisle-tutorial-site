import { MongoError, UpdateWriteOpResult, Db } from "mongodb";

/**
 * Static helper class resposible for handling all tutorial based DB operations/transactions
 *
 * @class
 * @todo feel free to remove RxJS and wrap the DB calls in a new promise
 * @author ale8k, rakeshshubhu
 */
export default class TutorialDbService {
    /**
     * Single DB ref from Server
     */
    public static db: Db;

    /**
     * Gets all documents in a collection of type
     *
     * @async
     * @param {string} collectionName collection name
     */
    public static getAllDocuments<T>(collectionName: string): Promise<T[]> {
        return new Promise((res, rej) => {
            TutorialDbService.db.collection<T>(collectionName).find({}).toArray((err, result) => {
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
     */
    public static createDocument<T>(collectionName: string, data: T): Promise<MongoUpdateResponse> {
        return new Promise((res, rej) => {
            TutorialDbService.db.collection(collectionName).insertOne(data).then(
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
     */
    public static updateSingleDocument(collectionName: string, predicate: object, newValue: object): Promise<UpdateWriteOpResult> {
        return new Promise((res, rej) => {
            TutorialDbService.db.collection(collectionName).updateOne(
                predicate,
                newValue,
                (err: MongoError, response: UpdateWriteOpResult) => {
                    err ? rej(err) : res(response);
                }
            );
        });
    }

}
