import React, { Component, ChangeEvent } from "react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import SaveDraftPlugin from "./Editor-Plugins/SaveDraftPlugin";
import DeletePlugin from "./Editor-Plugins/DeletePlugin";
import PublishPlugin from "./Editor-Plugins/PublishPlugin";
import ITutorial from "../../interfaces/ITutorial";
import { Subject, Subscription } from "rxjs";
import TutorialDbService from "../../services/TutorialDbService";
import { NotificationManager } from "react-notifications";
// CSS
import "react-markdown-editor-lite/lib/index.css";
import "./Editor.scss";
import "react-notifications/lib/notifications.css";

/**
 * Type returned from editor change
 */
type EditorOnChange = { text: string, html: string };

interface IEditorProps {
    updateTutorialList: Function;
    tutorial: ITutorial;
}

/**
 * A selfcontained edit/view for markdown
 * @author ale8k
 */
export default class Editor extends Component<IEditorProps, {}> {
    /**
     * The markdown parser to be passed to our markdown editor
     */
    private _mdParser: MarkdownIt = new MarkdownIt();
    /**
     * The subject to be passed to each of the plugins, they will all 
     * emit an option to be done with the locally stored tutorial here {@link tutorial Editor.tutorial}
     */
    private _plugin$: Subject<string> = new Subject<string>();
    /**
     * Holds the current state of content within the editor
     */
    private _cachedTutorial: ITutorial;
    /**
     * The subscription all {@link plugin$ Editor.plugin$} response events
     */
    private _pluginSub: Subscription;

    constructor(props: IEditorProps) {
        super(props);
        // Set the cached tutorial
        this._cachedTutorial = this.props.tutorial;
        // Set up plugin event sub
        this._pluginSub = this._plugin$.subscribe(d => {
            switch (d) {
                case "SAVE":
                    this.saveDraftTutorial();
                    break;
                case "DELETE":
                    this.deleteDraftTutorial();
                    break;
                case "PUBLISH":
                    this.publishTutorial();
                    break;
            }
        });

        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.saveDraftTutorial = this.saveDraftTutorial.bind(this);
        this.deleteDraftTutorial = this.deleteDraftTutorial.bind(this);
        this.publishTutorial = this.publishTutorial.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    /**
     * Update our cached tutorial
     */
    componentDidUpdate(): void {
        this._cachedTutorial = this.props.tutorial;
        console.log("updated current cached tut is: " + this._cachedTutorial.name);
    }

    /**
     * Setup plugins upon mount
     * @todo find alternative for componentWillMount, we just need to run this once...
     * Ideally before it's mounted.
     */
    public componentWillMount(): void {
        MdEditor.use(SaveDraftPlugin, { plugin$: this._plugin$ });
        MdEditor.use(DeletePlugin, { plugin$: this._plugin$ });
        MdEditor.use(PublishPlugin, { plugin$: this._plugin$ });
    }

    /**
     * Clean up plugin subscription
     */
    public componentWillUnmount(): void {
        this._pluginSub.unsubscribe();
    }

    /**
     * Updates the cached tutorial with the current editor content
     * @param {EditorOnChange} param0 an object containing the raw text and text parsed with html
     */
    private handleEditorChange({ text, html }: EditorOnChange): void {
        this._cachedTutorial.markdown = text;
        this._cachedTutorial.html = html;
    }

    /**
     * Changes the cached tutorials current category
     * @param {ChangeEvent<HTMLSelectElement>} e 
     */
    private handleCategoryChange(e:  ChangeEvent<HTMLSelectElement>): void {
        console.log("Category updated:", e.currentTarget.value);
        this._cachedTutorial.category = e.currentTarget.value;
        NotificationManager.info("CATEGORY CHANGED (BUT NOT SAVED)!");
    }

    /**
     * Changes the cached tutorials current name value
     * @param {ChangeEvent<HTMLInputElement>} e 
     */
    private handleNameChange(e:  ChangeEvent<HTMLInputElement>): void {
        console.log("Name updated:", e.currentTarget.value);
        this._cachedTutorial.name = e.currentTarget.value;
    }

    /**
     * Saves a tutorial to the localStorage
     */
    private saveDraftTutorial(): void {
        window.localStorage.setItem(this._cachedTutorial._id as string, JSON.stringify(this._cachedTutorial));
        NotificationManager.info("DRAFT SAVED!");
    }

    /**
     * Deletes a tutorial in the localStorage
     */
    private deleteDraftTutorial(): void {
        if (window.localStorage.getItem(this._cachedTutorial._id as string)) {
            window.localStorage.removeItem(this._cachedTutorial._id as string);
            NotificationManager.warning("Draft deleted...", "DRAFT DELETED", 2000);
        } else {
            NotificationManager.warning("Could not delete a draft because one does not exist...", "DRAFT DELETED FAILED", 5000);
        }
    }

    /**
     * Publishes a tutorial to the database
     * 
     * Side effects: 
     *  - Removes localStorage tutorial (if any) as we've completed our draft
     *  - Re-renders {@link App App} with fresh list of tutorials (including merged localStorage ones)
     */
    private publishTutorial(): void {
        TutorialDbService.saveTutorial(this._cachedTutorial).then(response => {
            window.localStorage.removeItem(this._cachedTutorial._id as string);
            if (response.ok) {
                NotificationManager.success("Tutorial published", "PUBLISH");
                this.props.updateTutorialList();
            } else {
                NotificationManager.error("Publish failed! See console for more info", "PUBLISH", 1000, () => {
                    console.log(response);
                });
            }
        });
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="Editor">
                <div>Category: 
                    <select onChange={(e) => this.handleCategoryChange(e)}>
                        {TutorialDbService.getCategories().map(cat => 
                            <option value={cat} selected={this.props.tutorial.category === cat ? true : false}>
                                {cat}
                            </option>
                        )}  
                    </select>
                </div>
                <div>Name:
                    <input defaultValue={this.props.tutorial.name} onChange={(e) => this.handleNameChange(e)}  type="text"/>
                </div>
                <MdEditor
                    value={this.props.tutorial.markdown}
                    style={{ height: "100vh", width: "100%" }}
                    renderHTML={(text) => this._mdParser.render(text)}
                    onChange={(e: EditorOnChange) => this.handleEditorChange(e)}
                />
            </div>
        );
    }

}


