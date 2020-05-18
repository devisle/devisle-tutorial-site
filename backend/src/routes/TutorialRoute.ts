import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import IRoute from "./interfaces/IRoute";
import TutorialController from "../controllers/TutorialController";
import CMSAuthService from "../services/CMSAuthService";

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

    // Middleware & controller setup
    constructor() {
        this.router.use("/tutorial/",this.authorisationCheck);
        this.router.get("/tutorial/", TutorialController.get); // get all? or by id?
        this.router.post("/tutorial/", TutorialController.post); // create a tutorial
        this.router.put("/tutorial/", TutorialController.put); // update a tutorial
    }

    /**
     * Checks if the JWT is still valid and hasn't expired,
     * stores the result in res.locals
     * This is used to protect the routes
     *
     * @param {Request<ParamsDictionary>} req the HTTP request object
     * @param {Response} res the response object
     * @param {NextFunction} next express.next() function to proceed in the middleware chain
     */
    private authorisationCheck(req: Request<ParamsDictionary>, res: Response, next: NextFunction): void {
        const token: string | undefined = req.headers.authorization;
        const authorised = CMSAuthService.verifyJWT(token);
        res.locals.authorised = authorised;
        next();
    }
}
