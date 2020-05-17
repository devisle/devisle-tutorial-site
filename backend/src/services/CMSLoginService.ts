import bcrypt from "bcrypt";
import MongoClient, { MongoError, UpdateWriteOpResult, ObjectId } from "mongodb";

type user = { _id: ObjectId, username: string, password: string };

/**
 * Static helper class resposible for handling the state/new state of a users login
 * for the CMS
 * @author ale8k, shreyas1307
 */
export default class CMSLoginService {
    /**
     * Takes a username and password, and compares it vs the current in the DB
     * @param {string} username given username from req.body
     * @param {string} password given password from req.body
     * @return {Promise<boolean>} a promise determining whether the the password and username could be found,
     * confirmed and we can proceed
     */
    public static checkLoginCredentials(username: string, password: string): Promise<boolean> {
        return new Promise((res, rej) => {
            MongoClient.connect(process.env.DB_URL as string).then(
                (client) => {
                    const attemptedUsername = username.toLowerCase();

                    client.db(process.env.DB_NAME).collection("cms-users").findOne({ username: attemptedUsername }, (err, result) => {
                        res(bcrypt.compare(password, (result as user).password));
                    });
                },
                (err) => {
                    if (err) {
                        rej(false);
                        throw new Error("DB connection failed" + err);
                    }
                }
            );
        });
    }

}
