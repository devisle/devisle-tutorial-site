/**
 * Represents a PUBLICALLY AVAILABLE tutorial
 *
 * // TODO
 *
 * @class
 * @author ale8k
 */
export default class PublicTutorial {
    /**
     * The Mongo user's GUID [who created this tutorial]
     *
     * @type {string}
     * @memberof Tutorial
     */
    public authorId: string;
    /**
     * The Mongo user's username [who created this tutorial]
     *
     * @type {string}
     * @memberof Tutorial
     */
    public authorName: string;
    /**
     * Soft-delete flag
     *
     * @type {string}
     * @memberof Tutorial
     */
    public isAvailable: boolean;
}
