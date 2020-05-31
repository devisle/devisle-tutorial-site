import * as log from "loglevel";
import Server from "../../App";
import supertest from "supertest";
import JestHelper from "../../JestHelper";
import { MongoClient, Db, Collection } from "mongodb";
import { UNAUTHORISED_TEXT, BAD_REQUEST_TEXT } from "../../constants";

/**
 * This test utilises [supertest]{@link https://www.npmjs.com/package/supertest}
 * and initialises the full server to perform the test per test.
 *
 * @author ale8k
 */
describe("CMSLoginController", () => {
    let connection: MongoClient;
    const collectionName = "cms-users";
    let db: Db;
    let collection: Collection;
    const correctCredentials = { username: "alex", password: "p123" };
    const incorrectCredentials = { username: "alex", password: "p1233" };
    const incorrectFormatCredentials = { username: 5, password: "p1233" };

    beforeAll(async () => {
        log.setDefaultLevel("silent");
        JestHelper.setupTestHTTPEnv();

        connection = await MongoClient.connect((global.__MONGO_URI__), {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db = await connection.db(global.__MONGO_DB_NAME__);
        collection = db.collection(collectionName);
        await collection.insertOne(
            {
                username: "alex",
                password: "$2b$12$Cp/IwyOUsKiJZTANWklBB.k4mv07lIV1gSLT4FbtsOI.eoFi2qfTu"
            }
        );
    });

    /**
     * /CMS/AUTH/LOGIN
     */
    it("/cms/auth/login should login successfully, with 200 response", (done) => {
        new Server({ path: ".env.testing" }).setupServer().then((app) => {
            supertest(app).post("/cms/auth/login").send(correctCredentials)
                .expect(200)
                .expect(response => {
                    expect(response.body.successfulLogin).toBe(true);
                }).end(done);
        });
    });

    it("/cms/auth/login should login unsuccessfully, with 401 response", (done) => {
        new Server({ path: ".env.testing" }).setupServer().then((app) => {
            supertest(app).post("/cms/auth/login").send(incorrectCredentials)
                .expect(401)
                .expect(response => {
                    expect(response.text).toBe(UNAUTHORISED_TEXT);
                }).end(done);
        });
    });

    it("/cms/auth/login should fail login procedure due to wrong credential format, with 400 response", (done) => {
        new Server({ path: ".env.testing" }).setupServer().then((app) => {
            supertest(app).post("/cms/auth/login").send(incorrectFormatCredentials)
                .expect(400)
                .expect(response => {
                    expect(response.text).toBe(BAD_REQUEST_TEXT);
                }).end(done);
        });
    });

    /**
     * /CMS/AUTH/CONFIRM
     */
    it("/cms/auth/confirm should confirm the user is logged in by returning name, with 200 response", (done) => {
        new Server({ path: ".test.env" }).setupServer().then((app) => {
            let jwt: string;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent.post("/cms/auth/login").send(correctCredentials)
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                }).end(() => {
                    agent.get("/cms/auth/confirm").set("Authorization", `Bearer ${jwt}`).expect(200).expect(response => {
                        expect(response.body.username).toBe("alex");
                    }).end(done);
                });
        });
    });

    it("/cms/auth/confirm should come back unauthorised, with 401 response", (done) => {
        new Server({ path: ".test.env" }).setupServer().then((app) => {
            const jwt: string = "e";
            const agent = supertest(app);
            agent.get("/cms/auth/confirm").set("Authorization", `Bearer ${jwt}`).expect(401).expect(response => {
                expect(response.text).toBe(UNAUTHORISED_TEXT);
            }).end(done);
        });
    });

    afterAll(() => {
        connection.close();
    });
});
