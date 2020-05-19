import React, { Component, RefObject } from "react";
import ITutorial from "../../interfaces/ITutorial";
import Modal from "react-modal";
import TutorialDbService from "../../services/TutorialDbService";
import { NotificationManager } from "react-notifications";
// CSS
import "react-markdown-editor-lite/lib/index.css";
import "./TutorialSelector.scss";

interface ITutorialManagerProps {
    rerenderParent: Function;
    tutorialList: ITutorial[];
}

interface ITutorialManagerState {
    modalToggle: boolean;
}

/**
 * The tutorial selector
 * @author ale8k 
 */
export default class TutorialSelector extends Component<ITutorialManagerProps, ITutorialManagerState> {
    /**
     * The current active tutorial for this render
     */
    private _activeTutorialId: string = "";

    constructor(props: ITutorialManagerProps) {
        super(props);

        this.state = {
            modalToggle: false
        };

        this.toggleCreatorModal = this.toggleCreatorModal.bind(this);
        this.renderTutorialCardList = this.renderTutorialCardList.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
    }

    /**
     * Opens/closes the creator modal
     */
    private toggleCreatorModal(): void {
        this.setState({
            modalToggle: !this.state.modalToggle
        });
    }

    /**
     * Emits the tutorial stored on this card to the App, used in rendering the correct editor
     * @param {React.MouseEvent<HTMLDivElement>} e users mouse event 
     * @param {ITutorial} tut the tutorial to emit update as the 'activeTutorial'
     */
    private handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, tut: ITutorial): void {
        this.props.rerenderParent();
        this._activeTutorialId = tut._id as string;
        this.props.rerenderParent({
            activeTutorial: tut
        });
        NotificationManager.info("SWITCH TO TUTORIAL: " + tut.name);
    }

    /**
     * Conditionally renders the tutorial card list
     * @returns {JSX.Element | JSX.Element[]} the loading or list of tuts
     */
    private renderTutorialCardList(): JSX.Element | JSX.Element[] {
        const respJSX = (<div style={{ height: "40px", textAlign: "center", marginTop: "5vh" }}>Loading...</div>);
        if (this.props.tutorialList.length !== 0) {
            return this.props.tutorialList.map(tut => {
                return(
                    <div className="tutorial-card" key={tut._id} onClick={(e) => {
                        this.handleCardClick(e, tut);
                    }}>
                        <p style={tut._id === this._activeTutorialId ? { color: "blue" } : { color: "grey" }}>{tut.name}</p>
                    </div>
                );
            });
        }
        return (respJSX);
    }

    /**
     * Creates a new tutorial with the given name,
     * upon successful creation, rerenders the parent with a fresh list of tutorials
     * @param {string} name tutorial name
     */
    private createTutorial(name: string): void {
        TutorialDbService.createTutorial(name).then((response) => {
            this.toggleCreatorModal();
            TutorialDbService.getAllTutorials().then(tutorials => {
                this.props.rerenderParent({
                    tutorialList: tutorials
                });
            });
            return response;
        }).then(response => {
            if (response === "SUCCESSFUL CREATION") {
                NotificationManager.success("Successfully created a tutorial", "SUCCESSFUL CREATION");
            } else {
                NotificationManager.error("Tutorial creation failed, see console for more info...", "CREATION FAILED", 3000);
            }
        });
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        const modalNameRef: RefObject<HTMLInputElement> = React.createRef();
        return (
            <div className="TutorialManager">
                <button className="create-btn" onClick={this.toggleCreatorModal}>Create tutorial</button>
                {this.renderTutorialCardList()}
                <Modal
                    isOpen={this.state.modalToggle}
                    className="creator-modal"
                >
                    <div className="modal-container">
                        <div className="modal-body">
                            <div>
                                Enter tutorial name: <br/>
                                <input ref={modalNameRef} type="text"/> <br/>

                            </div>
                            <button onClick={this.toggleCreatorModal}>Cancel</button>
                            <button onClick={() => this.createTutorial(modalNameRef.current?.value as string)}>Create</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

