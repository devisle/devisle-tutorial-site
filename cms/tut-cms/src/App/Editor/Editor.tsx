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
import Tutorial from "../../classes/Tutorial";
import TutorialDbService from "../../services/TutorialDbService";

/**
 * Type returned from each editor change
 */
type EditorOnChange = { text: string, html: string };

interface IEditorProps {
    tutorialManager$: Subject<ITutorial>;
    initialTutorial: ITutorial;
}

/**
 * A selfcontained edit/view for markdown
 * @author ale8k
 */
export default class Editor extends Component<IEditorProps, { tutorial: ITutorial }> {
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
     * The tutorial manager subject, to handle a full-rerender on tutorial change
     */
    private _tutorialManager$: Subject<ITutorial>;

    constructor(props: IEditorProps) {
        super(props);
        this._tutorialManager$ = this.props.tutorialManager$;
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this._plugin$.subscribe(d => {
            switch (d) {
                case "SAVE":
                    TutorialDbService.saveTutorial(this.state.tutorial);
                    break;
                case "DELETE":
                    // Delete removes from draft store & live collection
                    break;
                case "PUBLISH":
                    // Publish takes current tutorial and stores in the 'live' collection
                    break;
            }
        });
        this.state = {
            tutorial: this.props.initialTutorial
        };
        
    }

    /**
     * Setup plugins upon mount
     */
    public componentWillMount(): void {
        // Update state on each emit of change
        this._tutorialManager$.subscribe(d => {
            this.setState({
                tutorial: d
            });
        });
        MdEditor.use(SavePlugin, { plugin$: this._plugin$ });
        MdEditor.use(DeletePlugin, { plugin$: this._plugin$ });
        MdEditor.use(PublishPlugin, { plugin$: this._plugin$ });
    }

    /**
     * Updates the field ref containing this tutorial
     * @param {EditorOnChange} param0 an object containing the raw text and text parsed with html
     */
    private handleEditorChange({ text, html }: EditorOnChange): void {
        this.setState({
            tutorial: {
                name: this.state.tutorial.name,
                html,
                markdown: text
            }
        });
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="Editor">
                <MdEditor
                    value={this.state.tutorial.markdown}
                    style={{ height: "100vh" }}
                    renderHTML={(text) => this._mdParser.render(text)}
                    onChange={(e: EditorOnChange) => this.handleEditorChange(e)}
                />
            </div>
        );
    }

}


