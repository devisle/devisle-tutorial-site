import { MongoClient } from "mongodb";
import CMSAuthService from "../CMSAuthService";
import jwt from "jsonwebtoken";

/**
 * @author ale8k
 */
describe("CMSAuthService", () => {
    let connection;
    let testJwt: string;

    // Setup the DB for testing
    beforeAll(async () => {
        connection = await MongoClient.connect((global.__MONGO_URI__),{
                poolSize: 10,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        );
        CMSAuthService.db = await connection.db(global.__MONGO_DB_NAME__);

        await CMSAuthService.db.collection("cms-users").insertOne(
            {
                username: "alex",
                password: "$2b$12$Cp/IwyOUsKiJZTANWklBB.k4mv07lIV1gSLT4FbtsOI.eoFi2qfTu"
            }
        );

        testJwt = jwt.sign(
            { username: "alex ", userId: "1" },
            process.env.JWT_KEY as string,
            { expiresIn: "2 days" }
        );
    });

    // Clean up
    afterAll(async () => {
        // Clear mock users
        await CMSAuthService.db.collection("cms-users").deleteMany({});
    });

    it("checkLoginCredentials should confirm credentials safely", (done) => {
        CMSAuthService.checkLoginCredentials("alex", "p123").then(resp => {
            expect(resp.confirmation).toBe(true);
            done();
        });
    });

    it("checkLoginCredentials should fail credentials check", (done) => {
        CMSAuthService.checkLoginCredentials("alex", "p1233").then(resp => {
            expect(resp.confirmation).toBe(false);
            done();
        });
    });

    it("verifyJWT should verify the JWT as authentic", () => {
        expect(CMSAuthService.verifyJWT(`Bearer ${testJwt}`)).toBe(true);
    });
});
