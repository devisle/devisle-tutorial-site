import { Router } from "express";
import IRoute from "../interfaces/IRoute";
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

    /**
     * Middleware & controller setup
     */
    constructor() {
        this.router.post("/cms/login/", CMSLoginController.userLogin); // send new details or empty for token check
        this.router.get("/cms/login/confirm/", CMSLoginController.confirmUsedIsLoggedIn); // confirms a users JWT
    }

}
