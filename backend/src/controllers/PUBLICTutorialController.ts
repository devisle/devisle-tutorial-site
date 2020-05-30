import e, { Request, Response } from "express";
import PUBLICTutorialService from "../services/PUBLICTutorialService";
import { ObjectId, MongoError } from "mongodb";
import { BAD_OBJECTID_PARSE_TEXT, INTERNAL_ERROR_TEXT, TUTORIAL_CATEGORIES } from "../constants";

/**
 * PUBLIC Tutorial route controller
 *
 * @author ale8k
 */
export default class PUBLICTutorialController {
    /**
     * Grabs a PUBLIC tutorial by its Id
     *  - Endpoint takes the tutorial Id from the path params
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static getTutorialById(req: Request, res: Response): void {
        try {
            const tutObjectId = new ObjectId(req.params.tutId);
            PUBLICTutorialService.getPublicTutById("tutorials", tutObjectId).then(
                (response) => {
                    if (response === null) {
                        res.sendStatus(204).end();
                    } else {
                        res.status(200).send(response).end();
                    }
                },
                (err: MongoError) =>  res.status(500).send(INTERNAL_ERROR_TEXT + JSON.stringify(err)).end()
            );
        } catch (e) {
            res.status(400).send(BAD_OBJECTID_PARSE_TEXT).end();
        }
    }

    /**
     * Grabs a specified amount of tutorial cards in a given category
     *  - Requires the category in the path param, string
     *  - Query params are offset (number) & outset, both numbers, if omitted, it'll just return all
     *
     * An example of this endpoint would look like:
     * @example
     * /public/tutorials/cards/{category}?offset=*&outset=*
     * or
     * /public/tutorials/cards/{category}
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static getSpecifiedTutorialCards(req: Request, res: Response): void {
        if (PUBLICTutorialController.verifyCategory(req.params.category)) {
            PUBLICTutorialService.getTutCardsInCategory("tutorials", req.params.category).then(
                (cards) => {
                    if (req.query.offset && req.query.outset) {
                        const offset: number = parseInt(req.query.offset);
                        const outset: number = parseInt(req.query.outset);

                        if (Number.isInteger(offset) && Number.isInteger(outset)) {
                            res.status(200).send(cards.splice(offset, outset));
                        } else {
                            res.status(400).send("Query params for the category request must be integers");
                        }

                    } else {
                        res.send(cards);
                    }
                }
            );
        } else {
            res.status(404).send("The given category does not exist.");
        }
    }

    /**
     * Verifies if the category passed in exists in the CONSTANTS
     *
     * @param {string} category a tutorial category
     */
    private static verifyCategory(category: string): boolean {
        if (TUTORIAL_CATEGORIES.includes(category)) {
            return true;
        }
        return false;
    }

}
