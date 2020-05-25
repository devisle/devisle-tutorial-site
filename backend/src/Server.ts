import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import { MongoClient } from "mongodb";
import DbUpdateService from "./services/DbUpdateService";
import CMSAuthService from "./services/CMSAuthService";
import http from "http";

/**
 * Entry point
 *
 * @class
 * @author ale8k
 */
export default class Server {
    /**
     * @constant {Application} _app Express instance
     * Note, needs to be public so we can access the instance for
     * supertest.
     */
    public readonly APP: Application;
    /**
     * Server references
     */
    public server: http.Server;
    /**
     * @constant {Number | String} _port Server's primary port
     */
    private readonly _PORT: Number | String;

    /**
     * Registers:
     *  - ENV variables
     *  - Middlewares (global)
     *  - Routes
     *  - Port var
     *  - DB instance for services
     * Then finally, starts the server
     */
    constructor(configPath: { path: string }) {
        dotenv.config(configPath);
        this.APP = express();
        this.APP.use(cors());
        this.APP.use(bodyParser.urlencoded({
            extended: true
        }));
        this.APP.use(bodyParser.json());
        this._PORT = process.env.PORT || 3000;
        this.registerRoutes();

        /** Setup single db pool instance prior to APP launching */
        // SOMEONE REVIEW IF THIS IS CORRECT WAY OF DOING THIS!
        // THE METHODS HAVE CHANGED, AND THIS WAS ONLY WAY I COULD DO IT

        // todo, place this in generator alex, so that the test lib
        // can pickup on the db connection immediately
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
                    DbUpdateService.db = client.db(process.env.DB_NAME as string);
                    this.startServer();
                }
            }
        );
    }

    /**
     * Server initialisation
     */
    private startServer(): void {
        this.server = this.APP.listen(this._PORT, () => console.log(`Server running on ${this._PORT}`));
    }

    /**
     * Shut server down
     */
    private stopServer(): void {
        this.server.close();
    }

    /**
     * Loops through the index of routes in "./routes/index.ts"
     * and calls express.APP.use() on each RouteClass's router field.
     */
    private registerRoutes(): void {
        routes.forEach(route => {
            this.APP.use(new route().ROUTER);
        });
    }

}

new Server({ path: ".env"});

