import { Db, ObjectId, FindOneOptions } from "mongodb";
import IProjectedTutorial from "../interfaces/IProjectedTutorial";
import ISection from "../interfaces/ISection";
import PublicTutorial from "../dtos/PublicTutorial.dto";
import TutorialCard from "../dtos/TutorialCard.dto";

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
                }
            );
        });
    }

    /**
     * Gets all tutorial cards in a given category
     * @param response
     */
    public static getTutCardsInCategory(collectionName: string, queryCategory: string): Promise<TutorialCard[]> {
        return new Promise((res, rej) => {
            const tutCardProjection: FindOneOptions = {
                projection: {
                    _id: 1,
                    name: 1,
                    html: 1,
                    category: 1,
                    authorName: 1,
                    isAvailable: 1
                }
            };
            PUBLICTutorialService.db.collection(collectionName)
            .find<IProjectedTutorial & { _id: string }>({ category: queryCategory }, tutCardProjection)
            .toArray().then(
                (data) => {
                    // Now we need to strip the HTML out of the html tag, and create a 'tutorial card'
                    // example:
                    const responseCards: TutorialCard[] = data.map(preparsedCard => {
                        const { _id, name, html, category, authorName, isAvailable } = preparsedCard;
                        // Remove all html related
                        let cardText = html.replace(/<\/?[^>]+(>|$)/g, "");
                        // Remove section markers and give it a trim
                        cardText = cardText.replace("--##", "").trim();
                        // Grab only 105 chars, may be subject to change
                        cardText = cardText.substring(0, 105);
                        return new TutorialCard(_id, name, category, cardText, authorName, isAvailable);
                    });
                    res(responseCards);
                }
            );
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
