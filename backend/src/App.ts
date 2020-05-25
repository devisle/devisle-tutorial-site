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
 * App wrapper
 *
 * @class
 * @author ale8k
 */
export default class App {
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
     * Registers:
     *  - ENV variables
     *  - App instance
     */
    constructor(configPath: { path: string }) {
        console.log("Setting up environment...");
        dotenv.config(configPath);
        this.APP = express();
    }

    /**
     * Server initialisation
     */
    public async setupServer(): Promise<Application> {
        return await new Promise<Application>(res => {
            console.log("Setting up middleware...");
            this.APP.use(cors());
            this.APP.use(bodyParser.urlencoded({
                extended: true
            }));
            this.APP.use(bodyParser.json());
            this.registerRoutes();

            res(new Promise(async resolve => {
                console.log("Setting up db connection...");
                    await MongoClient.connect((process.env.DB_URL as string),
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
                            console.log("CMSAuthService db reference stored...");
                            DbUpdateService.db = client.db(process.env.DB_NAME as string);
                            console.log("DbUpdateService db reference stored...");
                            console.log("Resolving server...");
                            resolve(this.APP);
                        }
                    }
                );
            }));
        });
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

