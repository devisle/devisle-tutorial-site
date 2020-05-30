import { Db, ObjectId, FindOneOptions } from "mongodb";
import IProjectedTutorial from "../interfaces/IProjectedTutorial";
import ISection from "../interfaces/ISection";
import PublicTutorial from "../dtos/PublicTutorial.dto";

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
    public static getPublicTutById(collectionName: string, tutId: ObjectId): Promise<PublicTutorial | null> {
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
                    res(PUBLICTutorialService.parsePublicProjectTut(result));
                });
        });
    }

    /**
     * Takes an IProjectedTutorial and parses it into a PublicTutorial
     *
     * @param {IProjectedTutorial} response the projected tutorial brought back from the getter here
     */
    private static parsePublicProjectTut(response: IProjectedTutorial | null): PublicTutorial | null {
        if (response === null) {
            return null;
        }
        const html = response.html;
        // Remove bad starts, MUST start with a section
        const safeHtml = html.substring((html.indexOf("#") - 5));
        // Perform initial split, break the sections down into single string + body
        const sectionsSplit = safeHtml.split("<p>--##");
        sectionsSplit.shift();
        // Next, break section down into section title + body
        const sectionsBroken: ISection[] = [];

        sectionsSplit.forEach(sectionString => {
            // Grab section title
            const sectionTitle = sectionString.substring(0, sectionString.indexOf("</p>")).trim();
            // Grab the body html for this particular section
            const sectionBody = sectionString.substring(sectionString.indexOf("</p>") + 4).trim();
            sectionsBroken.push({
                sectionTitle,
                sectionBody
            });
        });

        const { name, category, authorName, isAvailable } = response;
        return new PublicTutorial(name, category, authorName, isAvailable, sectionsBroken);
    }
}
