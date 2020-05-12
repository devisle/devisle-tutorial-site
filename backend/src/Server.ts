import dotenv from "dotenv";
import express, { Application } from "express";
import routes from "./routes/index";

/**
 * The express.App main wrapper class
 * @author ale8k
 */
class Server {
    /**
     * Express application
     */
    private readonly _app: Application;
    /**
     * Server's primary port
     */
    private readonly _port: Number | String;

    // add prod/dev/test env's to the constructor, such that on
    // server instantiation we can quickly start a different env.
    constructor() {
        dotenv.config();
        this._app = express();
        this._port = process.env.PORT || 3000;
        this.registerRoutes();
    }

    /**
     * Server initialisation
     */
    public start(): void {
        this._app.listen(this._port, () => console.log(`Server running on ${this._port}`));
    }

    /**
     * Loops through the index of routes in "./routes/index.ts"
     * and calls express.App.use() on each RouteClass's router field.
     */
    private registerRoutes(): void {
        routes.forEach(route => {
            this._app.use(new route().router);
        });
    }

}

new Server().start();

