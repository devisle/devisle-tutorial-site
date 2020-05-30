import { Request, Response } from "express";
import PUBLICTutorialService from "../services/PUBLICTutorialService";
import { ObjectId, MongoError } from "mongodb";
import { BAD_OBJECTID_PARSE_TEXT, INTERNAL_ERROR_TEXT } from "../constants";

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
     *  - Query params are offset (number) & outset (string ['all'] / number), both numbers
     *
     * An example of this endpoint would look like:
     * @example /public/tutorials/cards/{category}?offset=*&outset=*
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static getSpecifiedTutorialCards(req: Request, res: Response): void {
        res.send("working");
    }

}
