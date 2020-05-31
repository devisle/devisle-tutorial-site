/**
 * Static helper class responsible for containing any further helpers
 * required in testing
 *
 * @class
 * @author ale8k
 */
export default class JestHelper {
    /**
     * Sets the process.env variables to specific test variables
     */
    public static setupTestHTTPEnv(): void {
        process.env.PORT = "3003";
        process.env.DB_URL = global.__MONGO_URI__;
        process.env.DB_NAME = global.__MONGO_DB_NAME__;
        process.env.BCRYPT_SALT = "12";
        process.env.JWT_KEY = "iamakeylol";
        process.env.JWT_EXPIRY = "2 days";
    }
}
