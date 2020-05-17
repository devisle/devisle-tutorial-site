import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import IRoute from "./interfaces/IRoute";
import CMSLoginController from "../controllers/CMSLoginController";

/**
 * The CMS login route
 * @class
 * @author ale8k
 */
export default class CMSLoginRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly router: Router = Router();

    // Middleware & controller setup
    constructor() {
        this.router.use("/cms/login/", this.exampleMiddleware);
        this.router.post("/cms/login/", CMSLoginController.userLogin); // send new details or empty for token check
    }

    /**
     * A method callback which can be passed into the router.use() middleware implementer function
     * @param {Request<ParamsDictionary>} req the HTTP request object
     * @param {Response<String>} res the response object
     * @param {NextFunction} next express.next() function to proceed in the middleware chain
     */
    private exampleMiddleware(req: Request<ParamsDictionary>, res: Response<String>, next: NextFunction): void {
        // do stuff
        console.log("I'm a middleware in the CMS dude");
        next();
    }
}
