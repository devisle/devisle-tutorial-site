import { Request, Response } from "express";

/**
 * Tutorial route controller
 * @author ale8k
 */
export default class TutorialController {
    public static get: (req: Request, res: Response) => void = TutorialController.getRequest;
    public static post: (req: Request, res: Response) => void = TutorialController.postRequest;

    /**
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async getRequest(req: Request, res: Response): Promise<void> {
        res.send("got me");
    }

    /**
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static async postRequest(req: Request, res: Response): Promise<void> {
        res.send("posted");
    }

}
