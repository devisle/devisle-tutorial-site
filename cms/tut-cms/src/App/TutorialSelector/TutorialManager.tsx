import React, { Component, RefObject } from "react";
import { Subject } from "rxjs";
import ITutorial from "../../interfaces/ITutorial";
import Modal from "react-modal";
import "./TutorialManager.scss";
import TutorialDbService from "../../services/TutorialDbService";



interface ITutorialManagerState {
    tutorialList: ITutorial[];
    modalToggle: boolean;
}

/**
 * The tutorial manager bar
 * @author ale8k
 */
export default class TutorialManager extends Component<{}, ITutorialManagerState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            tutorialList: [],
            modalToggle: false
        };

        this.toggleCreatorModal = this.toggleCreatorModal.bind(this);
        this.createTutorial = this.createTutorial.bind(this);
    }

    /**
     * Opens/closes the creator modal
     */
    private toggleCreatorModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.setState({
            modalToggle: !this.state.modalToggle
        });
    }


    /**
     * Creates a base tutorial document with only a name
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e mouse event emitted by user 
     * @param {RefObject<HTMLInputElement>} name reference to users typed input value for the name
     */
    private createTutorial(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: RefObject<HTMLInputElement>): void {
        const nameStr = name.current?.value;
        if (!nameStr) {
            throw new Error("Tutorial name cannot be undefined");
        }
        TutorialDbService.createTutorial(nameStr).then(() => {
            console.log("Posted successfully");
            this.toggleCreatorModal(e);
        }, () => {
            console.log("Post failed");
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
                            <button onClick={(e) => this.createTutorial(e, modalNameRef)}>Create</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

