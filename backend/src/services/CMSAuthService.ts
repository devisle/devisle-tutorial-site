import bcrypt from "bcrypt";
import MongoClient, { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

type user = { _id: ObjectId, username: string, password: string };
type TokenPayload = { username: string, userId: string, iat: number, exp: number }; // This is repeated
type LoginCredentialsResponse = { username: string, confirmation: boolean, userId: string };

/**
 * Static helper class resposible for handling the state/new state of a users login
 * for the CMS
 * @class
 * @author ale8k, shreyas1307
 */
export default class CMSAuthService {
    /**
     * Takes a username and password, and compares it vs the current in the DB
     *
     * @async
     * @param {string} username given username from req.body
     * @param {string} password given password from req.body
     * @returns {Promise<LoginCredentialsResponse>} a promise determining whether the the password and username could be found,
     * confirmed and we can proceed
     */
    public static checkLoginCredentials(username: string, password: string): Promise<LoginCredentialsResponse> {
        return new Promise((res, rej) => {
            MongoClient.connect(process.env.DB_URL as string).then(
                (client) => {
                    const attemptedUsername = username.toLowerCase();

                    client.db(process.env.DB_NAME).collection("cms-users").findOne({ username: attemptedUsername }, (err, result) => {
                        if (result === null) {
                            res({ confirmation: false } as LoginCredentialsResponse);
                        } else {
                             bcrypt.compare(password, (result as user).password).then(compareResp => {
                                res({
                                    username,
                                    confirmation: compareResp,
                                    userId: result._id
                                });
                            });
                        }
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

    /**
     * Syncronously verifies a JWT of a given CMS user attempting an API req
     *
     * @returns {boolean} whether or not the token is valid
     * @default false
     */
    public static verifyJWT(bearerToken: string | undefined): boolean {
        const tokenArr: string[] = bearerToken ? bearerToken.split(" ") : [];
        console.log("Attempting to verify");
        if (tokenArr[0] === "Bearer" && tokenArr[1] !== "undefined") {
            try {
                const payload: TokenPayload = jwt.verify(tokenArr[1], process.env.JWT_KEY as string) as TokenPayload;
                console.log(payload);
                return true;
            } catch (jsonWebTokenError) {
                console.log("User token expired");
                return false;
            }
        }

        return false;
    }

}
