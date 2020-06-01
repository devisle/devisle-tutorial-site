import IRoute from "../interfaces/IRoute";
import { Router } from "express";
import PublicTutorialController from "../controllers/PublicTutorialController";

/**
 * The public tutorial route
 *
 * @author ale8k
 */
export default class PublicTutorialRoute implements IRoute {
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
        this.ROUTER.get(
            this.RESOURCE_LOC + "/:tutId",
            PublicTutorialController.getTutorialById
        );
        this.ROUTER.get(
            this.RESOURCE_LOC + "/cards/:category",
            PublicTutorialController.getSpecifiedTutorialCards
        );
        this.ROUTER.get(
            this.RESOURCE_LOC + "/categories/all",
            PublicTutorialController.getAllCategories
        );
        this.ROUTER.get(
            this.RESOURCE_LOC + "/paths/all",
            PublicTutorialController.getAllPaths
        );
    }
}
