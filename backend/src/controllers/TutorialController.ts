import { Request, Response } from "express";
import { ObjectId, MongoError } from "mongodb";
import { Subject } from "rxjs";
import jwt from "jsonwebtoken";
import Tutorial from "../dtos/Tutorial.dto";
import PartialTutorial from "../dtos/PartialTutorial.dto";
import { INTERNAL_ERROR_TEXT, SUCCESSFUL_DOC_CREATION, BAD_REQUEST_TEXT } from "../constants";
import TutorialDbService from "../services/TutorialDbService";

/**
 * Tutorial route controller
 *
 * @author ale8k
 */
export default class TutorialController {
    /**
     * HTTP method handlers
     */
    public static get: (req: Request, res: Response) => void = TutorialController.getAllTutorials;
    public static post: (req: Request, res: Response) => void = TutorialController.createTutorial;
    public static put: (req: Request, res: Response) => void = TutorialController.updateTutorialById;

    /**
     * Grabs all the {@link tutorialDocs Tutoriall[]} and responds
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static getAllTutorials(req: Request, res: Response): void {
        TutorialDbService.getAllDocuments<Tutorial>("tutorials").then(
            (tutorials) => res.status(200).json(tutorials).end(),
            (err) => res.status(500).send(INTERNAL_ERROR_TEXT + JSON.stringify(err)).end()
        );
    }

    /**
     * Creates a base tutorial
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static createTutorial(req: Request, res: Response): void {
        if (TutorialController.validateTutorialData(req.body, 4)) {
            const token: string | undefined = req.headers.authorization;
            const tokenArr: string[] = token ? token.split(" ") : [];
            const { userId, username } = jwt.decode(tokenArr[1] as string) as TokenPayload;
            const { name, html, markdown, category } = req.body;
            const dto = new Tutorial(name, html, markdown, category, userId, username, true);

            TutorialDbService.createDocument<Tutorial>("tutorials", dto).then(
                () => res.status(200).send(SUCCESSFUL_DOC_CREATION).end(),
                () => res.status(500).send(INTERNAL_ERROR_TEXT + "TODO").end()
            );
        } else {
            res.status(400).send(BAD_REQUEST_TEXT).end();
        }

    }

    /**
     * Updates a tutorial by it's {@link _Id ObjectId}
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async updateTutorialById(req: Request, res: Response): Promise<void> {
        if (TutorialController.validateTutorialData(req.body, 5)) {
            const { _id, category, name, html, markdown } = req.body;
            const atomicDto = { $set: { ...new PartialTutorial(name, html, markdown, category) } };
            const predicateId = { _id: new ObjectId(_id) };

            TutorialDbService.updateSingleDocument("tutorials", predicateId, atomicDto).then(
                (resp) => res.status(200).json(resp).end(),
                (err: MongoError) => res.status(503).send("Error name: " + err.name + "Code: " + err.code + "Msg: " + err.errmsg)
            );
        }
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link partialTutorial PartialTutorial}
     *
     * @param {any} data the unknown data type
     * @param {number} keyLength have the check for keyLength vary, in some cases we want the _id so we'll expect the keys to
     * be 5
     * @returns {boolean} whether or not the data passed the structural check
     */
    private static validateTutorialData(data: any, keyLength: number): data is PartialTutorial {
        if (Object.keys(data).length === keyLength) {
            if (typeof data.html === "string"
                && typeof data.name === "string"
                && typeof data.markdown === "string"
                && typeof data.category === "string") {
                if (data.html !== undefined
                    && data.name !== undefined
                    && data.markdown !== undefined
                    && data.category !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }

}
