import React, { Component } from "react";
import Editor from "./Editor/Editor";
import TutorialManager from "./TutorialSelector/TutorialManager";
import { Subject } from "rxjs";
import "./App.scss";
import ITutorial from "../interfaces/ITutorial";


interface IAppState {
    initialTutorial: ITutorial | null;
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
                initialTutorial: d
            });
        });
        /**
         * The initial tutorial is here because our subscriber can't subscribe
         * in time to register the initial first clicked tutorial, so we send it here in this initial
         * state set just above ^
         */
        this.state = {
            initialTutorial: null
        };
    }
    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="App">
                <TutorialManager tutorialManager$={this._tutorialManager$} initialTutorial={this.state.initialTutorial}/>
                <div className="editor-container">
                    {
                        this.state.initialTutorial ? <Editor initialTutorial={this.state.initialTutorial} tutorialManager$={this._tutorialManager$}/> : <div>Select a card</div>
                    }
                </div>
            </div>
        );
    }

}


