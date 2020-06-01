import { Request, Response } from "express";
import { ObjectId, MongoError } from "mongodb";
import jwt from "jsonwebtoken";
import Tutorial from "../dtos/Tutorial.dto";
import PartialTutorial from "../dtos/PartialTutorial.dto";
import {
    INTERNAL_ERROR_TEXT,
    BAD_REQUEST_TEXT,
    BAD_OBJECTID_PARSE_TEXT
} from "../constants";
import DbUpdateService from "../services/DbUpdateService";

/**
 * CMS Tutorial route controller
 *
 * @author ale8k
 */
export default class CMSTutorialController {
    /**
     * Grabs all the {@link tutorialDocs Tutoriall[]} and responds
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static getAllTutorials(req: Request, res: Response): void {
        DbUpdateService.getAllDocuments<Tutorial>("tutorials").then(
            tutorials => res.status(200).json(tutorials).end(),
            err =>
                res
                    .status(500)
                    .send(INTERNAL_ERROR_TEXT + JSON.stringify(err))
                    .end()
        );
    }

    /**
     * Creates a base tutorial
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static createTutorial(req: Request, res: Response): void {
        if (CMSTutorialController.validateTutorialData(req.body, 4)) {
            const token: string | undefined = req.headers.authorization;
            const tokenArr: string[] = token ? token.split(" ") : [];
            const { userId, username } = jwt.decode(
                tokenArr[1]
            ) as TokenPayload;
            const { name, html, markdown, category } = req.body;
            const dto = new Tutorial(
                name,
                html,
                markdown,
                category,
                userId,
                username,
                true
            );

            DbUpdateService.createDocument<Tutorial>("tutorials", dto).then(
                result => res.status(201).send(result).end(),
                () =>
                    res
                        .status(500)
                        .send(INTERNAL_ERROR_TEXT + "TODO")
                        .end()
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
            const atomicDto = {
                $set: { ...new PartialTutorial(name, html, markdown, category) }
            };

            try {
                const predicateId = { _id: new ObjectId(tutId) };
                // Maybe send 304 on nModified: 0, but if we do, the body is absent.
                DbUpdateService.updateSingleDocument(
                    "tutorials",
                    predicateId,
                    atomicDto
                ).then(
                    resp => {
                        const {
                            result: { n, nModified, ok }
                        } = resp;
                        const formattedResponse: MongoUpdateResponse = {
                            ok,
                            n,
                            nModified
                        };
                        res.status(200).json(formattedResponse).end();
                    },
                    (err: MongoError) =>
                        res
                            .status(503)
                            .send(
                                "Error name: " +
                                    err.name +
                                    "Code: " +
                                    err.code +
                                    "Msg: " +
                                    err.errmsg
                            )
                );
            } catch (e) {
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
    private static validateTutorialData(
        data: any,
        keyLength: number
    ): data is PartialTutorial {
        if (Object.keys(data).length === keyLength) {
            if (
                typeof data.html === "string" &&
                typeof data.name === "string" &&
                typeof data.markdown === "string" &&
                typeof data.category === "string"
            ) {
                if (
                    data.html !== undefined &&
                    data.name !== undefined &&
                    data.markdown !== undefined &&
                    data.category !== undefined
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}
