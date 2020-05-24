
/**
 * All global types / interface types should be placed here.
 * TS-Node isn't able to pickup on types outside of here.
 * 
 * @author ale8k
 */

/** JWT token payload type alias */
declare type TokenPayload = { username: string, userId: string, iat: number, exp: number }
/** Login credentials (when attempting to gain token access) type alias */
declare type LoginCredentials = { username: string, password: string }
/** 
 * Mongo update response isn't typed, this is just an alias 
 *
 * @property {number} ok whether or not Mongo successfully attempted to update
 * @property {number} n The amount of documents affected by this query - expect this to be 1 if the document exists
 * @property {number} nModified The amount of documents modified
 */
declare type MongoUpdateResponse = { ok: number; n: number; nModified?: number };

