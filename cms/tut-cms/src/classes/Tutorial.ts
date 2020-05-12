import ITutorial from "../interfaces/ITutorial";

/**
 * General Tutorial object structure, to be created and persisted
 * @author ale8k
 */
export default class Tutorial implements ITutorial {
    /**
     * The tutorial name
     */
    private _name: string;
    /**
     * The HTML for this tutorial
     */
    private _content: string;

    constructor(name: string, content: string) {
        this._name = name;
        this._content = content;
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
    public get content(): string {
        return this._content;
    }

    /**
     * Sets the HTML for this tutorial
     */
    public set content(value: string) {
        this._content = value;
    }
    
    /**
     * Returns the correct property naming format when parsing to JSON
     */
    public toJSON(): { name: string, content: string } {
        return {
            name: this.name,
            content: this.content
        };
    }
    
}
