import React, { Component } from "react";
import Editor from "./Editor/Editor";
import "./App.scss";
import ITutorial from "../interfaces/ITutorial";
import TutorialDbService from "../services/TutorialDbService";
import TutorialSelector from "./TutorialSelector/TutorialSelector";
import { NotificationContainer } from "react-notifications";

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
        this.getTutorials = this.getTutorials.bind(this);
    }

    /**
     * Get the initial call of tutorials
     */
    public componentDidMount(): void {
        this.getTutorials();
    }

    /**
     * DEBUG
     */
    public componentDidUpdate(): void {
        //console.log(this.state.activeTutorial);
        //console.log(this.state.tutorialList);
        //this.getTutorials();
    }

    /**
     * Gets all tutorials in our localStorage (if any) and from our API,
     * it merges the localStorage in place of the API response tutorials and this creates
     * our final tutorial list
     */
    private getTutorials(): void {
        TutorialDbService.getAllTutorials().then((tutorials => {
            // Setup array store
            const localStoreTutorials: ITutorial[] = [];
            // Setup reference index store
            const localStoreTutorialIds: string[] = [];
            // Parse the JSON into our local store array
            for (const tut in localStorage) {
                let tutorial: string | ITutorial = localStorage[tut];
                if (typeof tutorial === "string") {
                    tutorial = JSON.parse(tutorial);
                    localStoreTutorials.push(tutorial as ITutorial);
                    localStoreTutorialIds.push((tutorial as ITutorial)._id as string);
                } 
            }

            // Loop through all tutorials gotten from API, merge our cached in and store
            const finalTutorialList = tutorials.map((tutorial, i) => {
                if (localStoreTutorialIds.includes(tutorial._id as string)) {
                    return localStoreTutorials[localStoreTutorialIds.indexOf(tutorial._id as string)];
                } else {
                    return tutorial;
                }
            });

            // Finally update the state of our tutorials to the merged list
            this.setState({
                tutorialList: finalTutorialList,
                activeTutorial: null
            });
        }));
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
                <NotificationContainer/>
                <TutorialSelector rerenderParent={this.rerender} tutorialList={this.state.tutorialList}/>
                <div className="editor-container">
                    { 
                        this.state.activeTutorial ? 
                            <Editor 
                                tutorial={this.state.activeTutorial} 
                                updateTutorialList={this.getTutorials}
                            /> 
                                    : 
                            <div>
                                Select a tutorial
                            </div>
                    }
                </div>
            </div>
        );
    }

}


