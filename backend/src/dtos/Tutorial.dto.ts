import PartialTutorial from "./PartialTutorial.dto";

/**
 * Represents a FULL tutorial, with no optionals (aside from _id)
 *
 * @class
 * @author ale8k
 */
export default class Tutorial extends PartialTutorial {
    /**
     * Set given DTO fields
     */
    constructor(
            name: string,
            html: string,
            markdown: string,
            category: string,
            authorId: string,
            authorName: string,
            isAvailable: boolean,
            id?: string) {
        super(name, html, markdown, category, id);
        this.authorId = authorId;
        this.authorName = authorName;
        this.isAvailable = isAvailable;
    }
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
