import IRoute from "../interfaces/IRoute";
import { Router } from "express";

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
}
