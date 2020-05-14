import React, { Component } from "react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import SavePlugin from "./Editor-Plugins/SavePlugin";
import DeletePlugin from "./Editor-Plugins/DeletePlugin";
import PublishPlugin from "./Editor-Plugins/PublishPlugin";
import "react-markdown-editor-lite/lib/index.css";
import "./Editor.scss";
import ITutorial from "../../interfaces/ITutorial";
import { Subject, Subscription } from "rxjs";
import TutorialDbService from "../../services/TutorialDbService";

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
                    this.saveTutorial();
                    break;
                case "PUBLISH":
                    this.publishTutorial();
                    break;
            }
        });

        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.saveTutorial = this.saveTutorial.bind(this);
        this.publishTutorial = this.publishTutorial.bind(this);
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
        MdEditor.use(SavePlugin, { plugin$: this._plugin$ });
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
     * Saves a tutorial to the localStorage
     */
    private saveTutorial(): void {
        window.localStorage.setItem(this._cachedTutorial._id as string, JSON.stringify(this._cachedTutorial));
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
                this.props.updateTutorialList();
            }
        });
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
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="Editor">
                <MdEditor
                    value={this.props.tutorial.markdown}
                    style={{ height: "100vh" }}
                    renderHTML={(text) => this._mdParser.render(text)}
                    onChange={(e: EditorOnChange) => this.handleEditorChange(e)}
                />
            </div>
        );
    }

}


