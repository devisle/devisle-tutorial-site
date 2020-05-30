import { Request, Response } from "express";
import PUBLICTutorialService from "../services/PUBLICTutorialService";
import { ObjectId, MongoError } from "mongodb";
import { BAD_OBJECTID_PARSE_TEXT, INTERNAL_ERROR_TEXT } from "../constants";
import PublicTutorial from "../dtos/PublicTutorial.dto";
import ISection from "src/interfaces/ISection";

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

}
