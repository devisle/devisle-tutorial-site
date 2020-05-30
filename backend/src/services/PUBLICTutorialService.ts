import { Db, ObjectId, FindOneOptions } from "mongodb";
import IProjectedTutorial from "src/interfaces/IProjectedTutorial";

/**
 * Static helper class resposible for handling PUBLIC db transactions
 *
 * @class
 * @author ale8k
 */
export default class PUBLICTutorialService {
    /**
     * Single DB ref from Server
     */
    public static db: Db;

    /**
     * Gets a PUBIC tutorial by Id
     *
     * @async
     * @param {string} collectionName collection name
     * @returns {Promise<T>} an array of the given documents
     */
    public static getPublicTutById(collectionName: string, tutId: ObjectId): Promise<IProjectedTutorial | null> {
        return new Promise((res, rej) => {
            const publicTutProjection: FindOneOptions = {
                projection: {
                    name: 1,
                    html: 1,
                    category: 1,
                    authorName: 1,
                    isAvailable: 1
                }
            };
            PUBLICTutorialService.db.collection(collectionName).findOne<IProjectedTutorial>({ _id: tutId }, publicTutProjection,
                (err, result) => {
                    if (err) {
                        rej(err);
                    }
                    res(result);
                });
        });
    }
}
