import Server from "../../Server";
import http from "http";
jest.mock("../../Server");
jest.setTimeout(30000);

/**
 * This test utilises [supertest]{@link https://www.npmjs.com/package/supertest}
 * and initialises the full server to perform the test.
 */
describe("DbUpdateService", () => {
    let server: http.Server;

    // Prepare server & ports n shizzle
    beforeAll(() => {
        process.env.PORT = "3003";
        process.env.DB_URL= global.__MONGO_URI__;
        process.env.DB_NAME = global.__MONGO_DB_NAME__;
        process.env.BCRYPT_SALT= "12";
        process.env.JWT_KEY = "iamakeylol";
        process.env.JWT_EXPIRY = "2 days";
        // Actually loads nothing lol, env is already set.
        server = new Server({ path: ".test.env" }).server;
    });

    // Clean up
    afterAll(() => {
        server.close();
    });

});
