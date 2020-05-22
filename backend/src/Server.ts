import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import { MongoClient } from "mongodb";
import TutorialDbService from "./services/TutorialDbService";
import CMSAuthService from "./services/CMSAuthService";

/**
 * Entry point
 *
 * @class
 * @author ale8k
 */
class Server {
    /**
     * @constant {Application} _app Express instance
     */
    private readonly _app: Application;
    /**
     * @constant {Number | String} _port Server's primary port
     */
    private readonly _port: Number | String;

    /**
     * Registers:
     *  - ENV variables
     *  - Middlewares (global)
     *  - Routes
     *  - Port var
     *  - DB instance for services
     * Then finally, starts the server
     */
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
        MongoClient.connect((process.env.DB_URL as string),
            {
                poolSize: 10,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err) {
                    throw err;
                } else {
                    CMSAuthService.db = client.db(process.env.DB_NAME as string);
                    TutorialDbService.db = client.db(process.env.DB_NAME as string);
                    this.startServer();
                }
            }
        );
    }

    /**
     * Server initialisation
     */
    private startServer(): void {
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

