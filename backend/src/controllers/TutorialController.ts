import { Request, Response } from "express";
import DbService, { MongoDbUpdateResponse } from "../services/TutorialDbService";
import ITutorial from "./interfaces/ITutorial";
import { ObjectId, MongoError } from "mongodb";
import { Subject } from "rxjs";
import jwt from "jsonwebtoken";

type TokenPayload = { username: string, userId: string, iat: number, exp: number }; // This is repeated

/**
 * Tutorial route controller
 * - Uses event driven async responses for db queries
 * - This is done via wiring a {@link subject Subject<T>} through the service methods
 * @todo maybe use single subject, test performance / Just wrap in another promise... ew
 *
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
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static getAllTutorials(req: Request, res: Response): void {
        // console.log(res.locals.authorised);
        const response$ = new Subject<ITutorial[]>();
        const sub = response$.subscribe((d) => {
            sub.unsubscribe();
            res.send(d);
            // console.log("Got all tutorials");
        });
        DbService.getAllDocuments<ITutorial>("tutorials", response$);
    }

    /**
     * Creates a base tutorial
     *
     * @todo fix the random JSON.stringify's lol, the respond is already a string!
     * Note, this will need CMS frontend adjusting too
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static createTutorial(req: Request, res: Response): void {

        if (res.locals.authorised) {
            console.log("route fired");
            const response$ = new Subject<string | MongoError>();
            const sub = response$.subscribe((d) => {
                sub.unsubscribe();
                res.send(JSON.stringify(d));
                console.log("Created tutorial");
            });
            console.log(req.body);
            if (TutorialController.structureCheck(req.body)) {
                const token: string | undefined = req.headers.authorization;
                const tokenArr: string[] = token ? token.split(" ") : [];
                const decodedToken = jwt.decode(tokenArr[1] as string) as TokenPayload;
                const fullTutorial: ITutorial = {
                    name: req.body.name,
                    html: req.body.html,
                    markdown: req.body.markdown,
                    category: req.body.category,
                    authorId: decodedToken.userId,
                    authorName: decodedToken.username,
                    isAvailable: true
                };
                DbService.createDocument<ITutorial>("tutorials", fullTutorial, response$);
            } else {
                res.send(JSON.stringify("UNSUCCESSFUL CREATION"));
            }
        } else {
            res.status(401).end();
        }
    }

    /**
     * Updates a tutorial by it's {@link _Id ObjectId}
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async updateTutorialByID(req: Request, res: Response): Promise<void> {
        if (res.locals.authorised) {
            const response$ = new Subject<MongoError | MongoDbUpdateResponse >();
            const sub = response$.subscribe((d) => {
                sub.unsubscribe();
                res.send(d);
                console.log("Published tutorial");
            });
            const tutorial = req.body as ITutorial;
            const atomicSetup = {
                $set: {
                    category: tutorial.category,
                    name: tutorial.name,
                    html: tutorial.html,
                    markdown: tutorial.markdown
                } as ITutorial
            };
            const predicateId = { _id: new ObjectId(tutorial._id) };
            DbService.updateSingleDocument("tutorials", predicateId, atomicSetup, response$);
        } else {
            res.status(401).end();
        }
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link ITutorial ITutorial}
     *
     * @param {any} data the unknown data type
     * @returns {boolean} whether or not the data passed the structural check
     */
    private static structureCheck(data: any): data is ITutorial {
        if (Object.keys(data).length === 4) {
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
