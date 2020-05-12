import { Request, Response } from "express";
import DbService from "../services/DbService";
import ITutorial from "./interfaces/ITutorial";

/**
 * Tutorial route controller
 * @author ale8k
 */
export default class TutorialController {
    /**
     * HTTP method handlers
     */
    public static get: (req: Request, res: Response) => void = TutorialController.getAllTutorials;
    public static post: (req: Request, res: Response) => void = TutorialController.createBaseTutorial;

    /**
     * Grabs all the {@link tutorialDocs ITutorial[]} and returns them from this route
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async getAllTutorials(req: Request, res: Response): Promise<void> {
        await TutorialController.getAllTutorialDocuments("tutorials").then(
            (tutArr) => {
                res.send(tutArr);
            }
        );

    }

    /**
     * Creates a base tutorial { name: <name>, content: <empty str> }
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async createBaseTutorial(req: Request, res: Response): Promise<void> {
        if (TutorialController.structureCheck(req.body)) {
            await TutorialController.createTutorialDocument("tutorials", req.body).then(
                () => {
                    res.send({ response: "OK", reason: "" });
                },
                () => {
                    res.send({ response: "BAD", reason: "DB FAILURE" });
                }
            );
        } else {
            console.log(req.body)
            res.send({ response: "BAD", reason: "INCORRECT FORMATTING"});
        }
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link ITutorial ITutorial}
     * @param {any} data the unknown data type
     */
    private static structureCheck(data: any): data is ITutorial {
        if (Object.keys(data).length === 3) {
            if (typeof data.html === "string" && typeof data.name === "string" && typeof data.markdown === "string") {
                if (data.html !== undefined && data.name !== undefined && data.markdown !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Creates a tutorial document within a given collection
     * @param {string} collectionName collection name
     * @param {ITutorial} tutorial any object type to be parsed and created as a document
     * @return {Promise<boolean>} a promise from the {@link createDoc DbService.createDocument<T>}
     * determining if the document inserted correctly
     */
    public static async createTutorialDocument(collectionName: string, tutorial: ITutorial): Promise<boolean> {
        return DbService.createDocument<ITutorial>(collectionName, tutorial);
    }

    /**
     * Gets all tutorial documents out of a given collection
     * @param {string} collectionName collection name
     * @return {Promise<ITutorial[]>} a promise containing all of the tutorial documents
     * @todo add parsing logic to filter other documents
     */
    public static async getAllTutorialDocuments(collectionName: string): Promise<void | ITutorial[]> {
        return await DbService.getAllDocuments<ITutorial>(collectionName);
    }

}
