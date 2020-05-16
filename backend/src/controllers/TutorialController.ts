import { Request, Response } from "express";
import DbService, { MongoDbUpdateResponse } from "../services/DbService";
import ITutorial from "./interfaces/ITutorial";
import { ObjectId, Db, MongoError } from "mongodb";
import { Subject } from "rxjs";

/**
 * Tutorial route controller
 * - Uses event driven async responses for db queries
 * - This is done via wiring a {@link subject Subject<T>} through the service methods
 * @todo maybe use single subject, test performance
 * @author ale8k
 */
export default class TutorialController {
    /**
     * HTTP method handlers
     */
    public static get: (req: Request, res: Response) => void = TutorialController.getAllTutorials;
    public static post: (req: Request, res: Response) => void = TutorialController.createTutorial;
    public static put: (req: Request, res: Response) => void = TutorialController.updateTutorialByID;

    /**
     * Grabs all the {@link tutorialDocs ITutorial[]} and resoonds
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static getAllTutorials(req: Request, res: Response): void {
        const response$ = new Subject<ITutorial[]>();
        const sub = response$.subscribe((d) => {
            sub.unsubscribe();
            res.send(d);
        });
        DbService.getAllDocuments<ITutorial>("tutorials", response$);
    }

    /**
     * Creates a base tutorial { name: <name>, content: <empty str> }
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static createTutorial(req: Request, res: Response): void {
        const response$ = new Subject<string | MongoError>();
        const sub = response$.subscribe((d) => {
            sub.unsubscribe();
            res.send(JSON.stringify(d));
        });
        if (TutorialController.structureCheck(req.body)) {
            DbService.createDocument<ITutorial>("tutorials", req.body as ITutorial, response$);
        }
    }

    /**
     * Updates a tutorial by it's {@link _Id ObjectId}
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async updateTutorialByID(req: Request, res: Response): Promise<void> {
        const response$ = new Subject<MongoError | MongoDbUpdateResponse >();
        const sub = response$.subscribe((d) => {
            sub.unsubscribe();
            res.send(d);
        });
        const tutorial = req.body as ITutorial;
        const atomicSetup = {
            $set: {
                name: tutorial.name,
                html: tutorial.html,
                markdown: tutorial.markdown
            } as ITutorial
        };
        const predicateId = { _id: new ObjectId(tutorial._id) };
        DbService.updateSingleDocument("tutorials", predicateId, atomicSetup, response$);
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link ITutorial ITutorial}
     * @param {any} data the unknown data type
     * @returns {boolean} whether or not the data passed the structural check
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

}
