import React, { Component } from "react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import SavePlugin from "./Editor-Plugins/SavePlugin";
import DeletePlugin from "./Editor-Plugins/DeletePlugin";
import PublishPlugin from "./Editor-Plugins/PublishPlugin";
import "react-markdown-editor-lite/lib/index.css";
import "./Editor.scss";

/**
 * Type returned from each editor change
 */
type EditorOnChange = { text: string, html: string };

/**
 * A selfcontained edit/view for markdown
 * @author ale8k
 */
export default class Editor extends Component<{}, {}> {
    /**
     * The markdown parser to be passed to our markdown editor
     */
    private _mdParser: MarkdownIt = new MarkdownIt();

    constructor(props: {}) {
        super(props);

        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    /**
     * Setup plugins upon mount
     */
    public componentWillMount(): void {
        MdEditor.use(SavePlugin);
        MdEditor.use(DeletePlugin);
        MdEditor.use(PublishPlugin);
    }

    /**
     * Calls any/all subsequent methods
     * @param {EditorOnChange} param0 an object containing the raw text and text parsed with html
     */
    private handleEditorChange({text, html}: EditorOnChange): void {
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="Editor">
                <MdEditor
                    value="some value"
                    style={{ height: "100vh" }}
                    renderHTML={(text) => this._mdParser.render(text)}
                    onChange={(e: EditorOnChange) => this.handleEditorChange(e)}
                />
            </div>
        );
    }

}


