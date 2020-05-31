import * as log from "loglevel";
import JestHelper from "../../JestHelper";
import App from "../../App";
import PublicTutorialService from "../../services/PublicTutorialService";
import supertest from "supertest";
import ITutorial from "src/interfaces/ITutorial";
import PublicTutorial from "src/dtos/PublicTutorial.dto";
import { MongoClient } from "mongodb";
import { BAD_OBJECTID_PARSE_TEXT } from "../../constants";

/**
 * This test utilises [supertest]{@link https://www.npmjs.com/package/supertest}
 * and initialises the full server to perform the test per test.
 *
 * @author ale8k
 */
describe("PublicTutorialController", () => {
    let connection: MongoClient;

    beforeAll(async () => {
        log.setDefaultLevel("silent");
        JestHelper.setupTestHTTPEnv();

        connection = await MongoClient.connect((global.__MONGO_URI__), {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        PublicTutorialService.db = await connection.db(global.__MONGO_DB_NAME__);

        await PublicTutorialService.db.collection("tutorials").insertOne({
            name: "another name",
            html: "somestuff that won't be considered     <p>--## Section 1</p>  <p>So this is my section, I'm talking crap here... <p>--## Section 2</p> more crap",
            markdown: "",
            category: "javascript",
            authorId: "5ec17321f63b3c281463fd2a",
            authorName: "alex",
            isAvailable: true
        });
    });

    afterAll(() => {
        connection.close();
    });

    /**
     * /PUBLIC/TUTORIALS/{TUTID}
     */
    it("/public/tutorials/{tutid} should return the parsed tutorial, with a 200 response", (done) => {
        PublicTutorialService.db.collection("tutorials").find({}).toArray().then(resp => {
            const lastAdded: ITutorial = resp[resp.length - 1];
            new App({ path: ".test.env" }).setupServer().then((app) => {
                const agent = supertest(app);
                agent.get(`/public/tutorials/${lastAdded._id}`)
                    .expect(200)
                    .expect(response => {
                        const tut: PublicTutorial = response.body;
                        expect(tut).not.toEqual(null);
                        expect(tut.content).toHaveLength(2);
                        expect(tut.content[0].sectionTitle).toEqual("Section 1");
                        expect(tut.content[0].sectionBody).toEqual("<p>So this is my section, I'm talking crap here...");
                        expect(tut.content[1].sectionTitle).toEqual("Section 2");
                        expect(tut.content[1].sectionBody).toEqual("more crap");
                        expect(Object.keys(tut).length).toEqual(5);
                    }).end(done);
            });
        });
    });

    it("/public/tutorials/{tutid} should return bad objectid parse message, with a 400 response", (done) => {
        new App({ path: ".test.env" }).setupServer().then((app) => {
            const agent = supertest(app);
            agent.get(`/public/tutorials/01223`)
                .expect(400)
                .expect(response => {
                    expect(response.text).toEqual(BAD_OBJECTID_PARSE_TEXT);
                }).end(done);
        });
    });

    it("/public/tutorials/{tutid} should return a 204 response", (done) => {
        new App({ path: ".test.env" }).setupServer().then((app) => {
            const agent = supertest(app);
            agent.get(`/public/tutorials/000000000000000000000000`)
                .expect(204).end(done);
        });
    });

    /**
     * /PUBLIC/TUTORIALS/CARDS/{CATEGORY}?OFFSET=*&OUTSET=*
     */
    it("/public/tutorials/cards/{category} should return the parsed tutorial, with a 200 response", (done) => {
        new App({ path: ".test.env" }).setupServer().then((app) => {
            const agent = supertest(app);
            agent.get(`/public/tutorials/cards/javascripT`)
                .expect(200)
                .expect(response => {
                    expect(response.body).not.toEqual(null);
                    expect(response.body[0].cardText).toEqual("Section 1  So this is my section, I'm talking crap here...  Section 2 more crap");
                }).end(done);
        });
    });

    it("/public/tutorials/cards/{category} should return 404, because the given category does not exist", (done) => {
        new App({ path: ".test.env" }).setupServer().then((app) => {
            const agent = supertest(app);
            agent.get(`/public/tutorials/cards/javascripT-a-none-existent-category`)
                .expect(404).end(done);
        });
    });

    it("/public/tutorials/cards/{category}?offset=*&outset=* should return 400, because the given values aren't integers", (done) => {
        new App({ path: ".test.env" }).setupServer().then((app) => {
            const agent = supertest(app);
            agent.get(`/public/tutorials/cards/javascripT?offset=bob&outset=harry`)
                .expect(400).end(done);
        });
    });

});
