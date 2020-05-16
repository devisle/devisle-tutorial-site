/**
 * Handles testing each DBService action and ensure it performs the correct operation
 * This test utilises
 * @author ale8k, rakeshshubhu
 */

import MongoDb, { MongoError, MongoClient } from "mongodb";
import DbService, { MongoDbUpdateResponse } from "../DbService";
import { Subject } from "rxjs";
import ITutorial from "../../controllers/interfaces/ITutorial";

describe("DbService", () => {
    let connection: MongoDb.MongoClient;
    let db: MongoDb.Db;

    const insertData = {
        _id: "1",
        name: "testing101",
        html: "",
        markdown: ""
    };

    beforeAll(async () => {
        process.env.DB_NAME = global.__MONGO_DB_NAME__;
        process.env.DB_URL = global.__MONGO_URI__;

        connection = await MongoClient.connect(process.env.DB_URL, {
            useNewUrlParser: true
        });
        db = await connection.db(process.env.DB_NAME);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await db.collection("tutorials").deleteMany({});
    });

    async function createTutorial(data: ITutorial): Promise<void> {
        await db.collection("tutorials").insertOne(data);
    }

    it("should get all documents from a collection", async (done) => {
        createTutorial(insertData);
        const response$: Subject<ITutorial[]> = new Subject<ITutorial[]>();
        response$.subscribe((d) => {
            expect(d).toHaveLength(1);
            done();
        });
        DbService.getAllDocuments<ITutorial>("tutorials", response$);
    });

    it("should insert a document into a collection and give us a 'SUCCESSFUL CREATION' response from the subject", async (done) => {
        const response$: Subject<string | MongoError> = new Subject<string | MongoError>();
        response$.subscribe((d) => {
            db.collection<ITutorial>("tutorials").find({}).toArray((err, result) => {
                expect(result[0]).toEqual(insertData);
                expect(d).toBe("SUCCESSFUL CREATION");
                done();
            });
        });
        DbService.createDocument<ITutorial>("tutorials", insertData, response$);
    });

    it("should update single document", async (done) => {
        const response$: Subject<MongoDbUpdateResponse | MongoError> = new Subject<MongoDbUpdateResponse | MongoError>();
        response$.subscribe((d) => {
            const resp = d as MongoDbUpdateResponse;
            if (resp.ok !== undefined) {
                expect(resp.nModified).toBe(1);
                done();
            }
        });
        const data: ITutorial = {
            _id: "69bro",
            name: "rakesh is a bro",
            html: "kishan is also a bro",
            markdown: "alex is a fat bro"
        };
        createTutorial(data);

        const modified: ITutorial = JSON.parse(JSON.stringify(data));
        modified.name = "blah blah";

        DbService.updateSingleDocument("tutorials", { _id: data._id }, { $set: modified }, response$);
    });

});
