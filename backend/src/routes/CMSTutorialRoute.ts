import { Router, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import IRoute from "../interfaces/IRoute";
import CMSTutorialController from "../controllers/CMSTutorialController";
import CMSAuthService from "../services/CMSAuthService";
import { UNAUTHORISED_TEXT } from "../constants";

/**
 * The CMS tutorial update route
 *
 * @author ale8k
 */
export default class CMSTutorialRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly ROUTER: Router = Router();
    /**
     * Resource location
     */
    public readonly RESOURCE_LOC: string = "/cms/tutorials";

    /**
     * Middleware & controller setup
     */
    constructor() {
        this.ROUTER.use(this.RESOURCE_LOC, this.authorisationCheck);
        this.ROUTER.get(this.RESOURCE_LOC + "/:operation", CMSTutorialController.operationRouter);
        this.ROUTER.post(this.RESOURCE_LOC + "/:operation", CMSTutorialController.operationRouter);
        this.ROUTER.put(this.RESOURCE_LOC + "/:operation", CMSTutorialController.operationRouter);
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
