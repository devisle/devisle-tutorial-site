/**
 * Request response code texts
 */
export const UNAUTHORISED_TEXT = "Access denied! Unauthorised.";
export const BAD_REQUEST_TEXT = "Server cannot process this request!";
export const INTERNAL_ERROR_TEXT =
    "Something went wrong on our side! See here: ";
export const NOT_FOUND_TEXT = "Resource could not be found.";
export const BAD_OBJECTID_PARSE_TEXT =
    "ObjectID argument passed in [the query] must be a single String of 12 bytes or a string of 24 hex";
/**
 * Tutorial categories supported by the site
 *
 * Fill this as we progress into new technologies
 * @todo store these in a .txt file tbh, they're more config than anything
 */
export const TUTORIAL_CATEGORIES = [
    "javascript",
    "python",
    "c#",
    "java",
    "react",
    "angular",
    "vue"
];
