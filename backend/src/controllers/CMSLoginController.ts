import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import CMSAuthService from "../services/CMSAuthService";
import { UNAUTHORISED_TEXT, BAD_REQUEST_TEXT, INTERNAL_ERROR_TEXT } from "../constants";

/**
 * Confirms login credentials of a given CMS user
 *
 * @class
 * @author ale8k, shreyas1307
 */
export default class CMSLoginController {
    /**
     * HTTP method handlers
     */
    public static post: (req: Request, res: Response) => void = CMSLoginController.login;
    public static get: (req: Request, res: Response) => void = CMSLoginController.confirmUserLoggedIn;

    /**
     * Attempts to log a user in
     *  - Validates the credentials format
     *  - Sends status 400 on bad format
     *  - Validates the existence of credentials, responds with JWT
     *  - If credentials cannot be found, sends status 401
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    private static login(req: Request, res: Response): void {
        if(CMSLoginController.validateLoginCredentials(req.body)) {
            const { attemptedUsername, password } = req.body;
            console.log("username:", attemptedUsername, "password:", password);

            CMSAuthService.checkLoginCredentials(attemptedUsername, password).then(
                ({ username, userId, confirmation }) => {
                    if (confirmation) {
                        // Note, this is able to take zeit/ms for expiry: [https://github.com/zeit/ms]
                        // Currently it's at 2 days because I feel this is enough time to produce a tutorial,
                        // we may alternatively opt for 'maxAge' property if this causes issues
                        res.json({
                            "successfulLogin": true,
                            "jwt": jwt.sign({ username, userId }, process.env.JWT_KEY as string, { expiresIn: process.env.JWT_EXPIRY })
                        }).status(200).end();
                    } else {
                        res.status(401).send(UNAUTHORISED_TEXT).end();
                    }
                },
                (err) => {
                    res.status(503).send("Error name: " + err.name + "Code: " + err.code + "Msg: " + err.errmsg).end();
                }
            );
        } else {
            res.status(400).send(BAD_REQUEST_TEXT).end();
        }
    }

    /**
     * Confirms whether or not a user is logged into the CMS
     *
     * @param {Request} req the users request obj
     * @param {Response} res our res obj
     */
    public static confirmUserLoggedIn(req: Request, res: Response): void {
        const token: string | undefined = req.headers.authorization;

        if (CMSAuthService.verifyJWT(token)) {
            const tokenArr: string[] = token ? token.split(" ") : [];
            const { username, userId} = jwt.decode(tokenArr[1] as string) as TokenPayload;
            res.status(200).json({ username, userId }).end();
        } else {
            res.status(401).send(UNAUTHORISED_TEXT).end();
        }
    }

    /**
     * Validates user credential data
     *  - Checks for data type of each property
     *  - Checks for lack of property [undefined]
     *  - Checks for empty string (correct type, bad data)
     *
     * @param {any} data the unknown data type
     * @returns {boolean} whether or not the data passed the structural check
     */
    private static validateLoginCredentials(data: any): data is LoginCredentials {
        if (Object.keys(data).length === 2) {
            if (typeof data.attemptedUsername === "string" && typeof data.password === "string") {
                if (data.attemptedUsername !== undefined && data.password !== undefined) {
                    if (data.attemptedUsername !== "" && data.password !== "") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}

