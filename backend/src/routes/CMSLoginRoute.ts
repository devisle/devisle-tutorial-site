import { Router } from "express";
import IRoute from "../interfaces/IRoute";
import CMSLoginController from "../controllers/CMSLoginController";

/**
 * The CMS login route
 *
 * @class
 * @author ale8k
 */
export default class CMSLoginRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly ROUTER: Router = Router();
    /**
     * Resource location
     */
    public readonly RESOURCE_LOC: string = "/cms/auth";

    /**
     * Middleware & controller setup
     */
    constructor() {
        this.ROUTER.post(this.RESOURCE_LOC + "/login", CMSLoginController.login);
        this.ROUTER.get(this.RESOURCE_LOC + "/confirm", CMSLoginController.confirmUserLoggedIn);
    }

}
