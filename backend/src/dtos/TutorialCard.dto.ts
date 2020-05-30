/**
 * Represents a PUBLIC TUTORIAL card
 * Cards have few options, they're effectively a precursor
 * to what the user will / should expect upon entering a tutorial.
 *
 * @class
 * @author ale8k
 */
export default class TutorialCard {
    /**
     * Set given DTO fields
     */
    constructor(
            id: string,
            tutName: string,
            category: string,
            cardText: string,
            authorName: string,
            isAvailable: boolean) {
        this._id = id;
        this.cardTutName = tutName;
        this.category = category;
        this.cardText = cardText;
        this.authorName = authorName;
        this.isAvailable = isAvailable;
    }
    /**
     * The tutorial mongodb id
     *
     * @type {string}
     * @memberof TutorialCard
     */
    public _id: string;
    /**
     * The tutorial name
     *
     * @type {string}
     * @memberof TutorialCard
     */
    public cardTutName: string;
    /**
     * The category name
     *
     * @type {string}
     * @memberof TutorialCard
     */
    public category: string;
    /**
     * The category name
     *
     * @type {string}
     * @memberof TutorialCard
     */
    public cardText: string;
    /**
     * The author's name (username)
     *
     * @type {string}
     * @memberof TutorialCard
     */
    public authorName: string;
    /**
     * Whether or not this tutorial is available (has it been soft-deleted?)
     *
     * @type {boolean}
     * @memberof TutorialCard
     */
    public isAvailable: boolean;
}
