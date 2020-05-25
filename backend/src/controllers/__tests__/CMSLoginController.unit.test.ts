import Server from "../../App";
import supertest from "supertest";
import { MongoClient, Db, Collection } from "mongodb";

/**
 * This test utilises [supertest]{@link https://www.npmjs.com/package/supertest}
 * and initialises the full server to perform the test per test.
 *
 * @author ale8k
 */
describe("CMSLoginController", () => {
    let connection;
    const collectionName = "cms-users";
    let db: Db;
    let collection: Collection;

    beforeAll(async () => {
        process.env.PORT = "3003";
        process.env.DB_URL = global.__MONGO_URI__;
        process.env.DB_NAME = global.__MONGO_DB_NAME__;
        process.env.BCRYPT_SALT = "12";
        process.env.JWT_KEY = "iamakeylol";
        process.env.JWT_EXPIRY = "2 days";

        connection = await MongoClient.connect((global.__MONGO_URI__), {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db = await connection.db(global.__MONGO_DB_NAME__);
        collection = db.collection(collectionName);
        await collection.insert(
            {
                username: "alex",
                password: "$2b$12$Cp/IwyOUsKiJZTANWklBB.k4mv07lIV1gSLT4FbtsOI.eoFi2qfTu"
            }
        );
    });

    it("should login successfully, with the correct response", async (done) => {
        await new Server({ path: ".env.testing" }).setupServer().then((app) => {
            supertest(app).post("/cms/auth/login").send({ username: "alex", password: "p123" })
            .expect(200)
            .expect(response => {
                expect(response.body.successfulLogin).toBe(true);
            }).end(done);
        });
    });

    it("should confirm the user is logged in according to their JWT", async (done) => {
        await new Server({ path: ".test.env" }).setupServer().then((app) => {
            let jwt: string;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent.post("/cms/auth/login").send({ username: "alex", password: "p123" })
            // Utilise supertest's callback to pass the JWT
            .expect(response => {
                jwt = response.body.jwt;
            }).end(() => {
                agent.get("/cms/auth/confirm").set("Authorization", `Bearer ${jwt}`).expect(response => {
                    expect(response.body.username).toBe("alex");
                }).end(done);
            });
        });
    });

});
