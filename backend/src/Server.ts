import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import { MongoClient } from "mongodb";
import TutorialDbService from "./services/TutorialDbService";
import CMSAuthService from "./services/CMSAuthService";

/**
 * Sets up all initial middlewares and the app instance itself
 *
 * @class
 * @classdesc {@link App App} registers the routers for this server
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
        this._app.use(cors());
        this._app.use(bodyParser.urlencoded({
            extended: true
        }));
        this._app.use(bodyParser.json());
        this._port = process.env.PORT || 3000;
        this.registerRoutes();

        /** Setup single db pool instance prior to app launching */
        // SOMEONE REVIEW IF THIS IS CORRECT WAY OF DOING THIS!
        // THE METHODS HAVE CHANGED, AND THIS WAS ONLY WAY I COULD DO IT
        MongoClient.connect((process.env.DB_URL as string), {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, client) => {
            if (err) {
                throw err;
            } else {
                CMSAuthService.db = client.db(process.env.DB_NAME as string);
                TutorialDbService.db = client.db(process.env.DB_NAME as string);
                this.start();
            }
        });
    }

    /**
     * Server initialisation
     */
    private start(): void {
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

new Server();

