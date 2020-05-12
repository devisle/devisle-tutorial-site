import React, { Component } from "react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import SavePlugin from "./Editor-Plugins/SavePlugin";
import DeletePlugin from "./Editor-Plugins/DeletePlugin";
import PublishPlugin from "./Editor-Plugins/PublishPlugin";
import "react-markdown-editor-lite/lib/index.css";
import "./Editor.scss";
import ITutorial from "../../interfaces/ITutorial";
import { Subject } from "rxjs";

/**
 * Type returned from each editor change
 */
type EditorOnChange = { text: string, html: string };

interface IEditorProps {
    tutorial: ITutorial;
}

/**
 * A selfcontained edit/view for markdown
 * @author ale8k
 */
export default class Editor extends Component<IEditorProps, {}> {
    /**
     * Class store for plugins to access the modified tutorial
     */
    public tutorial: ITutorial;
    /**
     * The markdown parser to be passed to our markdown editor
     */
    private _mdParser: MarkdownIt = new MarkdownIt();
    /**
     * The subject to be passed to each of the plugins, they will all 
     * emit an option to be done with the locally stored tutorial here {@link tutorial Editor.tutorial}
     */
    private _plugin$: Subject<string> = new Subject<string>();

    constructor(props: IEditorProps) {
        super(props);
        this.tutorial = this.props.tutorial;
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this._plugin$.subscribe(d => {
            console.log(d);
        });
    }

    /**
     * Setup plugins upon mount
     */
    public componentWillMount(): void {
        MdEditor.use(SavePlugin, { plugin$: this._plugin$ });
        MdEditor.use(DeletePlugin, { plugin$: this._plugin$ });
        MdEditor.use(PublishPlugin, { plugin$: this._plugin$ });
    }

    /**
     * Updates the field ref containing this tutorial
     * @param {EditorOnChange} param0 an object containing the raw text and text parsed with html
     */
    private handleEditorChange({text, html}: EditorOnChange): void {
        this.tutorial.html = html;
        this.tutorial.markdown = text;
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="Editor">
                <MdEditor
                    value={""}
                    style={{ height: "100vh" }}
                    renderHTML={(text) => this._mdParser.render(text)}
                    onChange={(e: EditorOnChange) => this.handleEditorChange(e)}
                />
            </div>
        );
    }

}


