import MongoClient, { MongoError, UpdateWriteOpResult } from "mongodb";
import { Subject } from "rxjs";

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
        console.log("Db service initialised!");
    }

    /**
     * Gets all documents in a collection of type
     * @param {string} collectionName collection name
     * @param {Subject<string>} response$ the subject to emit the response of the query back to the controller handler
     * @todo handle find error & fix force cast
     */
    public static getAllDocuments<T>(collectionName: string, response$: Subject<T>): void {
        MongoClient.connect(DbService._dbUrl).then(
            (client) => {
                console.log("Connected successfully to db");
                client.db(DbService._dbName).collection(collectionName).find({}).toArray((err, result) => {
                    response$.next(result as unknown as T); // forcefully cast the result to T
                });
                client.close();
            },
            (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
    }

    /**
     * Creates a document within a given collection
     * @param {string} collectionName collection name
     * @param {T} data any object type to be parsed and created as a document
     * @param {Subject<string>} response$ the subject to emit the response of the query back to the controller handler
     */
    public static createDocument<T>(collectionName: string, data: T, response$: Subject<string | MongoError>): void {
        MongoClient.connect(DbService._dbUrl).then(
            (client) => {
                console.log("Connected successfully to db");
                client.db(DbService._dbName).collection(collectionName).insertOne(data).then((d) => {
                    response$.next("SUCCESSFUL CREATION");
                },
                (err: MongoError) => {
                    response$.next(err);
                });
                client.close();
            },
            (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
    }

    /**
     * Updates a single document in a given collection
     * @param {string} collectionName collection name
     * @param {T} data the data to write over
     * @param {Subject<string | MongoError>} response$ the subject to emit the response of the query back to the controller handler
     */
    public static updateSingleDocument(collectionName: string, predicate: object, newValue: object,
            response$: Subject<string | MongoError>): void {
        MongoClient.connect(DbService._dbUrl).then(
            (client) => {
                console.log("Connected successfully to db");
                client.db(DbService._dbName).collection(collectionName).updateOne(
                    predicate,
                    newValue,
                    (err: MongoError, response: UpdateWriteOpResult) => {
                        if (err !== null) {
                            response$.next("UPDATED FAILED");
                            throw new Error("Update failed" + err);
                        } else {
                            response$.next(JSON.stringify(response.result));
                        }
                    }
                );
                client.close();
            },
            (err) => {
                if (err) {
                    throw new Error("DB connection failed" + err);
                }
            }
        );
    }

}
