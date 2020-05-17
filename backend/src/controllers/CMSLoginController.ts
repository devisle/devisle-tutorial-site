import { Request, Response } from "express";
import CMSLoginService from "../services/CMSLoginService";

type LoginCredentials = { username: string, password: string };

/**
 * @author ale8k, shreyas1307
 */
export default class CMSLoginController {
    /**
     * HTTP method handlers
     */
    public static post: (req: Request, res: Response) => void = CMSLoginController.login;

    /**
     * Login
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static login(req: Request, res: Response): void {
        const { username, password } = req.body as LoginCredentials;

        CMSLoginService.checkLoginCredentials(username, password).then((confirmation) => {
            console.log(confirmation);
        });

        res.send("working");
    }

    /**
     * Check credentials
     */
    /**
     * Perform fresh login
     */
    /**
     *
     */

}

