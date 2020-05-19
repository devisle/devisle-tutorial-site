import ITutorial from "../interfaces/ITutorial";

/**
 * General Tutorial object structure, to be created and persisted
 * @author ale8k
 */
export default class Tutorial implements ITutorial {
    /**
     * The tutorial category
     */
    private _category: string;
    /**
     * The tutorial name
     */
    private _name: string;
    /**
     * The HTML for this tutorial
     */
    private _html: string;
    /**
     * The markdown for this tutorial
     */
    private _markdown: string;
    /**
     * The tutorial ID
     */
    public _id: string = "";

    constructor(category: string, name: string, html: string, markdown: string) {
        this._category = category;
        this._name = name;
        this._html = html;
        this._markdown = markdown;
    }

    /**
     * Gets the category
     */
    public get category(): string {
        return this._category;
    }

    /**
     * Sets the category
     */
    public set category(value: string) {
        if (value === "") {
            throw new Error("Tutorial category cannot be an empty string");
        }
        this._category = value;
    }

    /**
     * Grabs the name |
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Sets the name
     */
    public set name(value: string) {
        if (value === "") {
            throw new Error("Tutorial name cannot be an empty string");
        }
        this._name = value;
    }

    /**
     * Gets the HTML
     */
    public get html(): string {
        return this._html;
    }

    /**
     * Sets the HTML for this tutorial
     */
    public set html(value: string) {
        this._html = value;
    }

    /**
     * Gets the markdown
     */
    public get markdown(): string {
        return this._markdown;
    }

    /**
     * Sets the markdown for this tutorial
     */
    public set markdown(value: string) {
        this._markdown= value;
    }
    
    /**
     * Returns the correct property naming format when parsing to JSON
     */
    public toJSON(): { category: string, name: string, html: string, markdown: string } {
        return {
            category: this.category,
            name: this.name,
            html: this.html,
            markdown: this.markdown
        };
    }
    
}
