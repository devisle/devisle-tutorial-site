import bcrypt from "bcrypt";
import { ObjectId, Db } from "mongodb";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import * as log from "loglevel";

type user = { _id: ObjectId, username: string, password: string };
type LoginCredentialsResponse = { checkedUsername: string, confirmation: boolean, userId: string };

/**
 * Static helper class resposible for handling the state/new state of a users login
 * for the CMS
 * @class
 * @author ale8k, shreyas1307
 */
export default class CMSAuthService {
    /**
     * Single DB ref from Server
     */
    public static db: Db;
    /**
     * LogLevel no conflict instance
     */
    private static l = log.noConflict();

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
            const attemptedUsername = username.toLowerCase();
            const attemptedPassword = password;

            CMSAuthService.db.collection("cms-users").findOne({ username: attemptedUsername }, (err, result) => {
                if (err) {
                    rej(err);
                }
                if (!result) {
                    res({ checkedUsername: "", confirmation: false, userId: "" });
                } else {
                    const correctPassword = (result as user).password;

                    this.comparePasswords(attemptedPassword, correctPassword).then(bool => {
                        res({ checkedUsername: username, confirmation: bool, userId: result._id });
                    });
                }
            });

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
        CMSAuthService.l.info(chalk.dim.magenta("Attempting to verify request token..."));
        if (tokenArr[0] === "Bearer" && tokenArr[1] !== "undefined") {
            try {
                jwt.verify(tokenArr[1], process.env.JWT_KEY as string);
                CMSAuthService.l.info(chalk.dim.green("Verified token successfully. Proceeding with request."));
                return true;
            } catch (jsonWebTokenError) {
                CMSAuthService.l.error(chalk.dim.redBright("Token verification failed! The token has either expired or is bad."));
                return false;
            }
        }
        return false;
    }

    /**
     * Compares two passwords and returns the result
     *
     * @async
     * @param {string} attemptedPassword the attempted password
     * @param {string} correctPassword the correct password retrieved from db
     * @returns {Promise<boolean>} whether or not they match
     */
    private static comparePasswords(attemptedPassword: string, correctPassword: string): Promise<boolean> {
        return bcrypt.compare(attemptedPassword, correctPassword);
    }

}
