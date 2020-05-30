import IRoute from "../interfaces/IRoute";
import { Router } from "express";
import PUBLICTutorialController from "../controllers/PUBLICTutorialController";

/**
 * The public tutorial route
 *
 * @author ale8k
 */
export default class PUBLICTutorialRoute implements IRoute {
    /**
     * Router instance
     */
    public readonly ROUTER: Router = Router();
    /**
     * Resource location
     */
    public readonly RESOURCE_LOC: string = "/public/tutorials";

    /**
     * Middleware & controller setup
     */
    constructor() {
        this.ROUTER.get(this.RESOURCE_LOC + "/:tutId", PUBLICTutorialController.getTutorialById);
        this.ROUTER.get(this.RESOURCE_LOC + "/cards/:category", PUBLICTutorialController.getSpecifiedTutorialCards);
        this.ROUTER.get(this.RESOURCE_LOC + "/categories/all", PUBLICTutorialController.getAllCategories);
    }
}
