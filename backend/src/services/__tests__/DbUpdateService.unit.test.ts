import { MongoClient } from "mongodb";
import CMSAuthService from "../CMSAuthService";

describe("CMSAuthService", () => {
    let connection;

    // Setup the DB for testing
    beforeAll(async () => {
        connection = await MongoClient.connect((global.__MONGO_URI__),{
                poolSize: 10,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        );
        CMSAuthService.db = await connection.db(global.__MONGO_DB_NAME__);

        await CMSAuthService.db.collection("tutorials");

    });

    // Clean up
    afterAll(async () => {
        // Clear mock tuts
        await CMSAuthService.db.collection("tutorials").remove({});
    });

});
