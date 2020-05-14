import React, { Component } from "react";
import Editor from "./Editor/Editor";
import "./App.scss";
import ITutorial from "../interfaces/ITutorial";
import TutorialDbService from "../services/TutorialDbService";
import TutorialSelector from "./TutorialSelector/TutorialSelector";


interface IAppState {
    tutorialList: ITutorial[];
    activeTutorial: ITutorial | null;
}

/**
 * App
 * @author ale8k
 */
export default class App extends Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            tutorialList: [],
            activeTutorial: null
        };

        this.rerender = this.rerender.bind(this);
    }

    /**
     * Get the initial call of tutorials
     */
    public componentDidMount(): void {
        TutorialDbService.getAllTutorials().then((tutorials => {
            this.setState({
                tutorialList: tutorials
            });
        }));
    }

    /**
     * DEBUG
     */
    public componentDidUpdate(): void {
        console.log(this.state.activeTutorial);
        //console.log(this.state.tutorialList);
    }

    /**
     * Forces a rerender
     * @param {IAppState} state optional param, update state if needed
     */
    private rerender(state?: IAppState): void {
        if (state) {
            this.setState(state);
        } else {
            this.forceUpdate();
        }
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="App">
                <TutorialSelector rerenderParent={this.rerender} tutorialList={this.state.tutorialList}/>
                <div className="editor-container">
                    { this.state.activeTutorial ? <Editor tutorial={this.state.activeTutorial} rerenderParent={this.rerender}/> : <div>Select a tutorial</div>}
                </div>
            </div>
        );
    }

}


