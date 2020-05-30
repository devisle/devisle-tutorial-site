import ISection from "src/interfaces/ISection";

/**
 * Represents a PUBLICALLY AVAILABLE tutorial
 *
 * @class
 * @author ale8k
 */
export default class PublicTutorial {
    /**
     * Set given DTO fields
     */
    constructor(
            name: string,
            category: string,
            authorName: string,
            isAvailable: boolean,
            content: ISection[]) {
        this.name = name;
        this.category = category;
        this.authorName = authorName;
        this.isAvailable = isAvailable;
        this.content = content;
    }
    /**
     * The tutorial name
     *
     * @type {string}
     * @memberof PublicTutorial
     */
    public name: string;
    /**
     * The tutorial category
     *
     * @type {string}
     * @memberof PublicTutorial
     */
    public category: string;
    /**
     * The Mongo user's username [who created this tutorial]
     *
     * @type {string}
     * @memberof PublicTutorial
     */
    public authorName: string;
    /**
     * Soft-delete flag
     *
     * @type {string}
     * @memberof PublicTutorial
     */
    public isAvailable: boolean;
    /**
     * The content of this tutorial, (big ass array)
     *
     * @type {ISection[]}
     * @memberof PublicTutorial
     */
    public content: ISection[];
}
