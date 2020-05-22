
/**
 * All global types / interface types should be placed here.
 * TS-Node isn't able to pickup on types outside of here.
 * 
 * @author ale8k
 */

/** JWT token payload type alias */
declare type TokenPayload = { username: string, userId: string, iat: number, exp: number }
/** Login credentials (when attempting to gain token access) type alias */
declare type LoginCredentials = { attemptedUsername: string, password: string }
/** Mongo update response isn't typed, this is just an alias */
declare type MongoUpdateResponse = { ok: number; n: number; nModified?: number };

