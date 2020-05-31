import PublicTutorialService from "../PublicTutorialService";
import ITutorial from "src/interfaces/ITutorial";
import { MongoClient, ObjectId } from "mongodb";

/**
 * @author ale8k
 */
describe("PublicTutorialService", () => {
    let connection;

    // Setup the DB for testing
    beforeAll(async () => {
        connection = await MongoClient.connect((global.__MONGO_URI__), {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        );
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

    // Clean up
    afterAll(async () => {
        // Clear mock tuts
        await PublicTutorialService.db.collection("tutorials").deleteMany({});
    });

    it("getPublicTutById should get a parsed IProjectedTutorial in the form of PublicTutorial", (done) => {
        PublicTutorialService.db.collection("tutorials").find({}).toArray().then(resp => {
            const lastAdded: ITutorial = resp[resp.length - 1];
            PublicTutorialService.getPublicTutById("tutorials", new ObjectId(lastAdded._id)).then(
                (response) => {
                    expect(response).not.toEqual(null);
                    expect(response?.content).toHaveLength(2);
                    expect(response?.content[0].sectionTitle).toEqual("Section 1");
                    expect(response?.content[0].sectionBody).toEqual("<p>So this is my section, I'm talking crap here...");
                    expect(response?.content[1].sectionTitle).toEqual("Section 2");
                    expect(response?.content[1].sectionBody).toEqual("more crap");
                    expect(Object.keys(response as Object).length).toEqual(5);
                    done();
                }
            );
        });
    });

    it("getTutCardsInCategory should get a parsed tutorial cards", (done) => {
        PublicTutorialService.getTutCardsInCategory("tutorials", "javascript").then(
            (response) => {
                expect(response).not.toEqual(null);
                expect(response[0].cardText).toEqual("Section 1  So this is my section, I'm talking crap here...  Section 2 more crap");
                done();
            }
        );
    });

});
