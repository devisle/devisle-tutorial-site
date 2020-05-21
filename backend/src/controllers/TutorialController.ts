import { Request, Response } from "express";
import DbService, { MongoDbUpdateResponse } from "../services/TutorialDbService";
import { ObjectId, MongoError } from "mongodb";
import { Subject } from "rxjs";
import jwt from "jsonwebtoken";
import Tutorial from "src/dtos/Tutorial.dto";
import PartialTutorial from "src/dtos/PartialTutorial.dto";
import { UNAUTHORISED_TEXT } from "../constants";

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
     * Grabs all the {@link tutorialDocs Tutoriall[]} and resoonds
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static getAllTutorials(req: Request, res: Response): void {
        const response$ = new Subject<Tutorial[]>();
        const sub = response$.subscribe((d) => {
            sub.unsubscribe();
            res.send(d);
        });
        DbService.getAllDocuments<Tutorial>("tutorials", response$);
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
                const fullTutorial: Tutorial = {
                    name: req.body.name,
                    html: req.body.html,
                    markdown: req.body.markdown,
                    category: req.body.category as string,
                    authorId: decodedToken.userId,
                    authorName: decodedToken.username,
                    isAvailable: true
                };
                DbService.createDocument<Tutorial>("tutorials", fullTutorial, response$);
            } else {
                res.send(JSON.stringify("UNSUCCESSFUL CREATION"));
            }
        } else {
            res.status(401).send(UNAUTHORISED_TEXT).end();
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
                console.log(d);
                res.send(d);
                console.log("Published tutorial");
            });
            const { _id, category, name, html, markdown } = req.body as PartialTutorial;
            const atomicSetup = {
                $set: {
                    category,
                    name,
                    html,
                    markdown,
                } as PartialTutorial
            };
            const predicateId = { _id: new ObjectId(_id) };
            DbService.updateSingleDocument("tutorials", predicateId, atomicSetup, response$);
        } else {
            res.status(401).send(UNAUTHORISED_TEXT).end();
        }
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link partialTutorial PartialTutorial}
     *
     * @param {any} data the unknown data type
     * @returns {boolean} whether or not the data passed the structural check
     */
    private static structureCheck(data: any): data is PartialTutorial {
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
