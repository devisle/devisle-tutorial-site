import { Request, Response } from "express";

/**
 * PUBLIC Tutorial route controller
 *
 * @author ale8k
 */
export default class PUBLICTutorialController {
    /**
     * Grabs a PUBLIC tutorial by its Id
     *
     * @async
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static getTutorialById(req: Request, res: Response): void {
        res.send("hi");
    }

}
