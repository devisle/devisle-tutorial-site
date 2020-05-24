import { Request, Response } from "express";
import { ObjectId, MongoError } from "mongodb";
import jwt from "jsonwebtoken";
import Tutorial from "../dtos/Tutorial.dto";
import PartialTutorial from "../dtos/PartialTutorial.dto";
import { INTERNAL_ERROR_TEXT, BAD_REQUEST_TEXT, BAD_OBJECTID_PARSE_TEXT, NOT_FOUND_TEXT } from "../constants";
import TutorialUpdateService from "../services/TutorialUpdateService";

/**
 * Tutorial route controller
 *
 * @author ale8k
 */
export default class CMSTutorialController {
    /**
     * Routes the operation to the correct controller method.
     * Extensions to this will be done via nested switch / standard check if single.
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static operationRouter(req: Request, res: Response): void {
        switch (req.params.operation) {
            case "get-all":
                CMSTutorialController.getAllTutorials(req, res);
                break;
            case "create":
                CMSTutorialController.createTutorial(req, res);
                break;
            case "update":
                CMSTutorialController.updateTutorialById(req, res);
                break;
            default:
                res.status(404).send(NOT_FOUND_TEXT).end();
        }
    }

    /**
     * Grabs all the {@link tutorialDocs Tutoriall[]} and responds
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static getAllTutorials(req: Request, res: Response): void {
        TutorialUpdateService.getAllDocuments<Tutorial>("tutorials").then(
            (tutorials) => res.status(200).json(tutorials).end(),
            (err) => res.status(500).send(INTERNAL_ERROR_TEXT + JSON.stringify(err)).end()
        );
    }

    /**
     * Creates a base tutorial
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static createTutorial(req: Request, res: Response): void {
        if (CMSTutorialController.validateTutorialData(req.body, 4)) {
            const token: string | undefined = req.headers.authorization;
            const tokenArr: string[] = token ? token.split(" ") : [];
            const { userId, username } = jwt.decode(tokenArr[1] as string) as TokenPayload;
            const { name, html, markdown, category } = req.body;
            const dto = new Tutorial(name, html, markdown, category, userId, username, true);

            TutorialUpdateService.createDocument<Tutorial>("tutorials", dto).then(
                () => res.status(200).send({ ok: 1, n: 1 }).end(),
                () => res.status(500).send(INTERNAL_ERROR_TEXT + "TODO").end()
            );
        } else {
            res.status(400).send(BAD_REQUEST_TEXT).end();
        }

    }

    /**
     * Updates a tutorial by it's {@link _Id ObjectId}
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static updateTutorialById(req: Request, res: Response): void {
        const tutId = req.query.tutId;

        if (CMSTutorialController.validateTutorialData(req.body, 4) && tutId) {
            const { category, name, html, markdown } = req.body;
            const atomicDto = { $set: { ...new PartialTutorial(name, html, markdown, category) } };

            try {
                const predicateId = { _id: new ObjectId(tutId) };

                TutorialUpdateService.updateSingleDocument("tutorials", predicateId, atomicDto).then(
                    (resp) => {
                        const { result: { n, nModified, ok } } = resp;
                        const formattedResponse: MongoUpdateResponse = { ok, n, nModified };
                        res.status(200).json(formattedResponse).end();
                    },
                    (err: MongoError) => res.status(503).send("Error name: " + err.name + "Code: " + err.code + "Msg: " + err.errmsg)
                );
            } catch(e) {
                res.status(400).send(BAD_OBJECTID_PARSE_TEXT).end();
            }
        } else {
            res.status(400).send(BAD_REQUEST_TEXT).end();
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
