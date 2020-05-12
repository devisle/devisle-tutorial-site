import { Request, Response } from "express";
import DbService from "../services/DbService";
import ITutorial from "./interfaces/ITutorial";
import CommandResult from "mongodb";
import { Resolver } from "dns";

/**
 * Tutorial route controller
 * @author ale8k
 */
export default class TutorialController {
    public static get: (req: Request, res: Response) => void = TutorialController.getRequest;
    public static post: (req: Request, res: Response) => void = TutorialController.createBaseTutorial;

    /**
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async getRequest(req: Request, res: Response): Promise<void> {
        res.send("got me");
    }

    /**
     * Creates a base tutorial { name: <name>, content: <empty str> }
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async createBaseTutorial(req: Request, res: Response): Promise<void> {
        if (TutorialController.structureCheck(req.body)) {
            await DbService.createTutorialDocument("tutorials", req.body).then(
                () => {
                    res.send("Document created and saved successfully");
                },
                () => {
                    res.send("Something went wrong");
                }
            );
        } else {
            res.send("Tutorial formatted incorrectly");
        }
    }

    /**
     * Checks the incoming tutorial object structure to be of type {@link ITutorial ITutorial}
     * @param {any} data the unknown data type
     */
    private static structureCheck(data: any): data is ITutorial {
        if (Object.keys(data).length === 2) {
            if (typeof data.content === "string" && typeof data.name === "string") {
                if (data.content !== undefined && data.name !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }

}
