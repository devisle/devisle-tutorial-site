import * as log from "loglevel";
import Server from "../../App";
import supertest from "supertest";
import PartialTutorial from "../../dtos/PartialTutorial.dto";
import Tutorial from "../../dtos/Tutorial.dto";
import JestHelper from "../../JestHelper";
import { MongoClient, Db, Collection } from "mongodb";
import { BAD_REQUEST_TEXT, BAD_OBJECTID_PARSE_TEXT } from "../../constants";

/**
 * This test utilises [supertest]{@link https://www.npmjs.com/package/supertest}
 * and initialises the full server to perform the test per test.
 *
 * @author ale8k
 */
describe("CMSTutorialController", () => {
    let connection: MongoClient;
    const usersCollectionName = "cms-users";
    const tutorialsCollectionName = "tutorials";
    let db: Db;
    let usersCollection: Collection;
    let tutorialsCollection: Collection;

    beforeAll(async () => {
        log.setDefaultLevel("silent");
        JestHelper.setupTestHTTPEnv();

        connection = await MongoClient.connect(global.__MONGO_URI__, {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db = connection.db(global.__MONGO_DB_NAME__);
        usersCollection = db.collection(usersCollectionName);
        tutorialsCollection = db.collection(tutorialsCollectionName);
        await usersCollection.insertOne({
            username: "alex",
            password:
                "$2b$12$Cp/IwyOUsKiJZTANWklBB.k4mv07lIV1gSLT4FbtsOI.eoFi2qfTu"
        });
    });

    afterEach(async () => {
        await db.collection(tutorialsCollectionName).deleteMany({});
    });

    /**
     * /CMS/TUTORIALS/CREATE
     */
    it("cms/tutorials/create should create a tutorial, with a 200 response", done => {
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .post("/cms/tutorials/create")
                        .set("Authorization", `Bearer ${jwt}`)
                        .send(
                            new PartialTutorial(
                                "tutorial",
                                "html",
                                "markdown",
                                "category"
                            )
                        )
                        .expect(201)
                        .end(() => {
                            agent
                                .get("/cms/tutorials/all")
                                .set("Authorization", `Bearer ${jwt}`)
                                .expect(response => {
                                    const tutArr = response.body as Tutorial[];
                                    const tut = tutArr[0];
                                    expect(tut.isAvailable).toBe(true);
                                })
                                .end(done);
                        });
                });
        });
    });

    it("cms/tutorials/create should attempt to create a tutorial with bad data, with a 400 response", done => {
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .post("/cms/tutorials/create")
                        .set("Authorization", `Bearer ${jwt}`)
                        .send({
                            name: "",
                            html: "lol",
                            markdown: "derp",
                            category: 69
                        })
                        .expect(400)
                        .end(done);
                });
        });
    });

    /**
     * /CMS/TUTORIALS/ALL
     */
    it("cms/tutorials/all should retrieve all tutorials, with a 200 response", async done => {
        await tutorialsCollection.insertOne(
            new Tutorial(
                "test tut",
                "html",
                "markdown",
                "category",
                "1",
                "bob",
                true,
                "1"
            )
        );
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .get("/cms/tutorials/all")
                        .set("Authorization", `Bearer ${jwt}`)
                        .expect(200)
                        .expect(response => {
                            const tutArr = response.body as Tutorial[];
                            const tut = tutArr[0];
                            expect(tut.isAvailable).toBeTruthy();
                        })
                        .end(done);
                });
        });
    });

    /**
     * /CMS/TUTORIALS/UPDATE?TUTID=******
     */
    it("cms/tutorials/update? should update a tutorial successfully, with a 200 response", async done => {
        await tutorialsCollection.insertOne(
            new Tutorial(
                "test tut",
                "html",
                "markdown",
                "category",
                "1",
                "bob",
                true
            )
        );
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            let tut: Tutorial;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .get("/cms/tutorials/all")
                        .set("Authorization", `Bearer ${jwt}`)
                        .expect(200)
                        .expect(response => {
                            const tutArr = response.body as Tutorial[];
                            tut = tutArr[0];
                        })
                        .end(() => {
                            // /cms/tutorials/update?tutId=
                            agent
                                .put("/cms/tutorials/update?tutId=" + tut._id)
                                .set("Authorization", `Bearer ${jwt}`)
                                .send({
                                    name: "shreyas has a name",
                                    html: "changed",
                                    markdown: "changed",
                                    category: "changed"
                                })
                                .expect(200)
                                .expect(resp => {
                                    const respBody: MongoUpdateResponse =
                                        resp.body;
                                    expect(respBody.ok).toBe(1);
                                    expect(respBody.n).toBe(1);
                                    expect(respBody.nModified).toBe(1);
                                })
                                .end(done);
                        });
                });
        });
    });

    it("cms/tutorials/update? should attempt to update a tutorial, with bad objectid, with a 400 response", async done => {
        await tutorialsCollection.insertOne(
            new PartialTutorial("test tut", "html", "markdown", "category")
        );
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            let tut: Tutorial;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .get("/cms/tutorials/all")
                        .set("Authorization", `Bearer ${jwt}`)
                        .expect(200)
                        .expect(response => {
                            const tutArr = response.body as Tutorial[];
                            tut = tutArr[0];
                        })
                        .end(() => {
                            agent
                                .put(
                                    `/cms/tutorials/update?tutId=${
                                        tut._id as string
                                    }5`
                                )
                                .set("Authorization", `Bearer ${jwt}`)
                                .send({
                                    name: "changed",
                                    html: "changed",
                                    markdown: "changed",
                                    category: "changed"
                                })
                                .expect(400)
                                .expect(resp => {
                                    expect(resp.text).toBe(
                                        BAD_OBJECTID_PARSE_TEXT
                                    );
                                })
                                .end(done);
                        });
                });
        });
    });

    it("cms/tutorials/update? should attempt to update a tutorial, with tut data, with a 400 response", async done => {
        await tutorialsCollection.insertOne(
            new PartialTutorial("test tut", "html", "markdown", "category")
        );
        new Server({ path: ".test.env" }).setupServer().then(app => {
            let jwt: string;
            let tut: Tutorial;
            const agent = supertest(app);
            // Grab our JWT by logging in
            agent
                .post("/cms/auth/login")
                .send({ username: "alex", password: "p123" })
                // Utilise supertest's callback to pass the JWT
                .expect(response => {
                    jwt = response.body.jwt;
                })
                .end(() => {
                    agent
                        .get("/cms/tutorials/all")
                        .set("Authorization", `Bearer ${jwt}`)
                        .expect(200)
                        .expect(response => {
                            const tutArr = response.body as Tutorial[];
                            tut = tutArr[0];
                        })
                        .end(() => {
                            agent
                                .put(
                                    `/cms/tutorials/update?tutId=${
                                        tut._id as string
                                    }`
                                )
                                .set("Authorization", `Bearer ${jwt}`)
                                .send({
                                    name: "changed",
                                    html: "changed",
                                    markdown: "changed",
                                    category: 5
                                })
                                .expect(400)
                                .expect(resp => {
                                    expect(resp.text).toBe(BAD_REQUEST_TEXT);
                                })
                                .end(done);
                        });
                });
        });
    });

    afterAll(() => {
        connection.close();
    });
});
