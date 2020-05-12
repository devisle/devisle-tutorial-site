import React, { Component } from "react";
import Editor from "./Editor/Editor";
import TutorialManager from "./TutorialSelector/TutorialManager";
import { BehaviorSubject } from "rxjs";
import "./App.scss";

/**
 * Basic entry point,
 * has only two components, the tutorial selector/creator and the editor for the tutorials
 * @author ale8k
 */
export default class App extends Component<{},{}> {
    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="App">
                <TutorialManager/>
                <div className="editor-container">
                    {
                        <Editor/>
                    }
                </div>
            </div>
        );
    }

}


