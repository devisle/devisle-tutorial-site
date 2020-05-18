import MongoClient, { MongoError, UpdateWriteOpResult } from "mongodb";
import { Subject } from "rxjs";

export type MongoDbUpdateResponse = { ok: number; n: number; nModified: number; };

/**
 * Static helper class resposible for handling all tutorial based DB operations/transactions
 *
 * @class
 * @todo feel free to remove RxJS and wrap the DB calls in a new promise
 * @author ale8k, rakeshshubhu
 */
export default class TutorialDbService {
    constructor() {
        console.log("Db service initialised!");
    }

    /**
     * Gets all documents in a collection of type
     *
     * @param {string} collectionName collection name
     * @param {Subject<string>} response$ the subject to emit the response of the query back to the controller handler
     * @todo handle find error & fix force cast
     */
    public static getAllDocuments<T>(collectionName: string, response$: Subject<T[]>): void {
        MongoClient.connect(process.env.DB_URL as string).then(
            (client) => {
                console.log("Connected successfully to db");
                client.db(process.env.DB_NAME as string).collection<T>(collectionName).find({}).toArray((err, result) => {
                    response$.next(result); // forcefully cast the result to T
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
     *
     * @param {string} collectionName collection name
     * @param {T} data any object type to be parsed and created as a document
     * @param {Subject<string>} response$ the subject to emit the response of the query back to the controller handler
     */
    public static createDocument<T>(collectionName: string, data: T, response$: Subject<string | MongoError>): void {
        MongoClient.connect(process.env.DB_URL as string).then(
            (client) => {
                //console.log("Connected successfully to db");
                client.db(process.env.DB_NAME as string).collection(collectionName).insertOne(data).then(({result}) => {
                    if (result.ok) {
                        response$.next("SUCCESSFUL CREATION");
                    } else {
                        response$.next("UNSUCCESSFUL CREATION");
                    }
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
     *
     * @param {string} collectionName collection name
     * @param {T} data the data to write over
     * @param {Subject<string | MongoError>} response$ the subject to emit the response of the query back to the controller handler
     */
    public static updateSingleDocument(collectionName: string, predicate: object, newValue: object,
            response$: Subject<MongoDbUpdateResponse  | MongoError>): void {
        MongoClient.connect(process.env.DB_URL as string).then(
            (client) => {
                console.log("Connected successfully to db");
                client.db(process.env.DB_NAME as string).collection(collectionName).updateOne(
                    predicate,
                    newValue,
                    (err: MongoError, response: UpdateWriteOpResult) => {
                        if (err !== null) {
                            response$.next(err);
                            throw new Error("Update failed" + err);
                        } else {
                            response$.next(response.result as MongoDbUpdateResponse);
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
