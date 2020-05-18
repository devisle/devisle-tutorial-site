import React, { Component } from "react";
import Editor from "./Editor/Editor";
import ITutorial from "../interfaces/ITutorial";
import TutorialDbService from "../services/TutorialDbService";
import TutorialSelector from "./TutorialSelector/TutorialSelector";
import { NotificationContainer } from "react-notifications";
// CSS
import "./App.scss";
import Login from "./Login/Login";
import AuthService from "../services/AuthService";

interface IAppState {
    tutorialList: ITutorial[];
    activeTutorial: ITutorial | null;
    loggedIn: boolean;
    username: string | null;
    userId: string | null;
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
            activeTutorial: null,
            loggedIn: false,
            username: null,
            userId: null
        };

        this.rerender = this.rerender.bind(this);
        this.updateUserLoginState = this.updateUserLoginState.bind(this);
        this.getTutorials = this.getTutorials.bind(this);
        this.renderEditorInstance = this.renderEditorInstance.bind(this);

        // Now we feed a reference of the 'updateUserLoginState()' into the TutDbService,
        // this will be called under 401 circumstances
        AuthService.updateUserLoginState = this.updateUserLoginState;
        
    }

    /**
     * Get the initial call of tutorials upon successful login
     */
    public componentDidMount(): void {
        this.updateUserLoginState();
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
     * Checks the users login state, and updates top level App state accordingly
     * This is also where we grab important info on our user, including their id and username
     */
    private updateUserLoginState(): void {
        AuthService.checkUserIsLoggedIn().then((d) => {
            console.log("User is logged in?:", d.username ? true : false);
            if (d.username && d.userId) {
                this.getTutorials();
                this.setState({
                    loggedIn: true,
                    username: d.username,
                    userId: d.userId
                });
            } else {
                this.setState({
                    loggedIn: false
                });
            }

        });
    }

    /**
     * Gets all tutorials in our localStorage (if any) and from our API,
     * it merges the localStorage in place of the API response tutorials and this creates
     * our final tutorial list
     * 
     * @todo move this to TutorialDbService
     */
    private getTutorials(): void {
        TutorialDbService.getAllTutorials().then((tutorials => {
            const apiTutorials = tutorials;
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
            const finalTutorialList = apiTutorials.map((tutorial, i) => {
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
     * Renders the notification container, tutorial selector and editor instance
     */
    private renderEditorInstance(): JSX.Element {
        return (
            <div style={{ display: "flex", width: "100vw" }}>
                <NotificationContainer/>
                <TutorialSelector rerenderParent={this.rerender} tutorialList={this.state.tutorialList}/>
                <div className="editor-container">
                    { 
                        this.state.activeTutorial ? 
                            <div style={{ width: "100%" }}><Editor 
                                tutorial={this.state.activeTutorial} 
                                updateTutorialList={this.getTutorials}
                            /></div> 
                                    : 
                            <div>
                                Select a tutorial
                            </div>
                    }
                </div>
            </div>
        );
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <div className="App">
                { !this.state.loggedIn ? <Login updateUserLoginState={this.updateUserLoginState}/> : this.renderEditorInstance()}
            </div>
        );
    }

}


