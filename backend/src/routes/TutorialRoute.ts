import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import IRoute from "./interfaces/IRoute";
import TutorialController from "../controllers/TutorialController";

/**
 * The tutorial route
 * @author ale8k
 */
export default class TutorialRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly router: Router = Router();

    // Middleware & controller setup
    constructor() {
        this.router.use(this.exampleMiddleware);
        this.router.get("/tutorial/", TutorialController.get); // get all? or by id?
        this.router.post("/tutorial/", TutorialController.post); // create a tutorial
        this.router.put("/tutorial/:id"); // update a tutorial
        this.router.patch("/tutorial/:id");// fix small piece of tutorial
    }

    /**
     * A method callback which can be passed into the router.use() middleware implementer function
     * @param req the HTTP request object
     * @param res the response object
     * @param next express.next() function to proceed in the middleware chain
     */
    private exampleMiddleware(req: Request<ParamsDictionary>, res: Response<String>, next: NextFunction): void {
        // do stuff
        console.log("I'm a middleware dude");
        next();
    }
}
