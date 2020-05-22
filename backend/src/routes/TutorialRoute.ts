import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import IRoute from "../interfaces/IRoute";
import CMSTutorialController from "../controllers/CMSTutorialController";
import CMSAuthService from "../services/CMSAuthService";
import { UNAUTHORISED_TEXT } from "../constants";

/**
 * The tutorial route
 *
 * @author ale8k
 */
export default class TutorialRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly router: Router = Router();

    /**
     * Middleware & controller setup
     */
    constructor() {
        this.router.use("/tutorial/",this.authorisationCheck);
        this.router.get("/tutorial/", CMSTutorialController.get); // get all? or by id?
        this.router.post("/tutorial/", CMSTutorialController.post); // create a tutorial
        this.router.put("/tutorial/", CMSTutorialController.put); // update a tutorial
    }

    /**
     * JWT check
     *  - Checks if still valid
     *  - Continues middleware chain if it is valid
     *  - Denies request from here if not valid
     *
     * @param {Request<ParamsDictionary>} req the HTTP request object
     * @param {Response} res the response object
     * @param {NextFunction} next express.next() function to proceed in the middleware chain
     */
    private authorisationCheck(req: Request<ParamsDictionary>, res: Response, next: NextFunction): void {
        const token: string | undefined = req.headers.authorization;
        const authorised = CMSAuthService.verifyJWT(token);
        if (!authorised) {
            res.status(401).send(UNAUTHORISED_TEXT).end();
        } else {
            next();
        }
    }
}
