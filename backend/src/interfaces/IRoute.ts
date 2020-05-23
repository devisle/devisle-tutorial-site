import { Router } from "express";

/**
 * Implements a routes:
 *  @property {Router} ROUTER Express router instance
 *  @property {string} RESOURCE_LOC Resource location
 *
 * @author ale8k;
 */
export default interface IRoute {
    readonly ROUTER: Router;
    readonly RESOURCE_LOC: string;
}
