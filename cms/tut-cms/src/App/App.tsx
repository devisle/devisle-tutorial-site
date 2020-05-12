import React, { Component } from "react";
import Editor from "./Editor/Editor";
import TutorialManager from "./TutorialSelector/TutorialManager";
import { Subject } from "rxjs";
import "./App.scss";
import ITutorial from "../interfaces/ITutorial";

interface IAppState {
    activeTutorial: ITutorial | null;
}

/**
 * Basic entry point,
 * has only two components, the tutorial selector/creator and the editor for the tutorials
 * @author ale8k
 */
export default class App extends Component<{}, IAppState> {
    /**
     * Transfer subject from manager -> editor selection,
     * emits the tutorial to be used in props
     */
    private _tutorialManager$: Subject<ITutorial> = new Subject<ITutorial>();

    constructor(props: {}) {
        super(props);
        this._tutorialManager$.subscribe((d) => {
            this.setState({
                activeTutorial: d
            });
        });

        this.state = {
            activeTutorial: null
        };
    }
    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="App">
                <TutorialManager tutorialManager$={this._tutorialManager$} activeTutorial={this.state.activeTutorial}/>
                <div className="editor-container">
                    {
                        this.state.activeTutorial ? <Editor tutorial={this.state.activeTutorial}/> : <div>Select a card</div>
                    }
                </div>
            </div>
        );
    }

}


