import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import CMSLoginService from "../services/CMSLoginService";

type LoginCredentials = { username: string, password: string };

/**
 * @class
 * @author ale8k, shreyas1307
 */
export default class CMSLoginController {
    /**
     * HTTP method handlers
     */
    public static userLogin: (req: Request, res: Response) => void = CMSLoginController.login;

    /**
     * Simply checks a users credentials and if successful, signs a JWT into the cookies
     * along with a helpful JSON response in the body
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static login(req: Request, res: Response): void {
        const { username, password } = req.body as LoginCredentials;

        CMSLoginService.checkLoginCredentials(username, password).then((confirmation) => {
            if (confirmation) {
                // Note, this is able to take zeit/ms for expiry: [https://github.com/zeit/ms]
                // Currently it's at 2 days because I feel this is enough time to produce a tutorial,
                // we may alternatively opt for 'maxAge' property if this causes issues
                const token = jwt.sign({ currentlyLoggedIn: true }, process.env.JWT_KEY as string, {
                    expiresIn: "10000"
                });
                res.cookie("jwt", token);
                res.json({
                    "successfulLogin": true
                });
            } else {
                // Force a clear regardless...
                res.clearCookie("jwt");
                res.json({
                    "successfulLogin": false
                });
            }
        });
    }

}

