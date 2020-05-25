import { MongoClient } from "mongodb";
import DbUpdateService from "../DbUpdateService";

describe("DbUpdateService", () => {
    let connection;
    const collectionName = "test";

    // Setup the DB for testing
    beforeAll(async () => {
        connection = await MongoClient.connect((global.__MONGO_URI__),{
                poolSize: 10,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        );
        DbUpdateService.db = await connection.db(global.__MONGO_DB_NAME__);

        await DbUpdateService.db.collection(collectionName).insert(
            {
                iamatest: "lol"
            }
        );
    });

    // Clean up
    afterEach(async () => {
        // Clear mock tuts
        await DbUpdateService.db.collection(collectionName).remove({});
    });

    it("getAllDocuments<T> should return all documents in a given collection", (done) => {
        DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(data => {
            expect(data.length).toBe(1);
            done();
        });
    });

    it("createDocument<T> should create a single document", (done) => {
        DbUpdateService.createDocument<{ iamatest: string }>(collectionName, { iamatest: "lol" }).then(data => {
            expect(data.ok).toBe(1);
            expect(data.n).toBe(1);
            expect(data.nModified).toBe(undefined);
            done();
        });
    });

    it("updateSingleDocument should update a document correctly", async (done) => {
        await DbUpdateService.createDocument<{ iamatest: string }>(collectionName, { iamatest: "lol" });
        await DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(async () => {
            await DbUpdateService.updateSingleDocument(collectionName, { iamatest: "lol" }, { $set: { iamatest: "changed" } })
            .then(async () => {
                await DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(async (changed) => {
                    expect(changed[0].iamatest).toBe("changed");
                    done();
                });
            });
        });
    });

});
