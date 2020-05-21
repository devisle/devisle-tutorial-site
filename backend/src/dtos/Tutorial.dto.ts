import PartialTutorial from "./PartialTutorial.dto";

/**
 * Represents a FULL tutorial, with no optionals
 *
 * @class
 * @author ale8k
 */
export default abstract class Tutorial extends PartialTutorial {
    /**
     * The Mongo user's GUID [who created this tutorial]
     * @abstract
     * @type {string}
     * @memberof Tutorial
     */
    public abstract authorId: string;
    /**
     * The Mongo user's username [who created this tutorial]
     * @abstract
     * @type {string}
     * @memberof Tutorial
     */
    public abstract authorName: string;
    /**
     * Soft-delete flag
     * @abstract
     * @type {string}
     * @memberof Tutorial
     */
    public abstract isAvailable: boolean;
}
