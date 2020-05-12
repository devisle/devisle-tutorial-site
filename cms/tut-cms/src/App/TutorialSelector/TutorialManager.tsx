import React, { Component, RefObject } from "react";
import ITutorial from "../../interfaces/ITutorial";
import Modal from "react-modal";
import "./TutorialManager.scss";
import TutorialDbService from "../../services/TutorialDbService";
import { Subject } from "rxjs";

interface ITutorialManagerProps {
    tutorialManager$: Subject<ITutorial>;
    initialTutorial: ITutorial | null;
}

interface ITutorialManagerState {
    tutorialList: ITutorial[];
    modalToggle: boolean;
}

/**
 * The tutorial manager bar
 * @author ale8k
 */
export default class TutorialManager extends Component<ITutorialManagerProps, ITutorialManagerState> {
    constructor(props: ITutorialManagerProps) {
        super(props);

        this.state = {
            tutorialList: [],
            modalToggle: false
        };

        this.toggleCreatorModal = this.toggleCreatorModal.bind(this);
        this.createTutorial = this.createTutorial.bind(this);
        this.renderTutorialList = this.renderTutorialList.bind(this);
        this.rerenderTutList = this.rerenderTutList.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
    }

    /**
     * Update the tutorial selection list upon mount
     */
    public componentDidMount(): void {
        this.rerenderTutList();
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
            this.rerenderTutList();
            this.toggleCreatorModal(e);
        }, () => {
            console.log("Post failed");
        });
        
    }

    /**
     * Emits the tutorial stored on this card to the App, used in rendering the correct editor
     * @param {React.MouseEvent<HTMLDivElement>} e users mouse event 
     * @param {ITutorial} tut the tutorial to emit through the {@link subject ITutorialManagerProps.tutorialManager$}
     */
    private handleCardClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, tut: ITutorial): void {
        this.props.tutorialManager$.next(tut);
    }

    /**
     * Conditionally renders the tutorial card list
     * @returns {JSX.Element | JSX.Element[]} the loading or list of tuts
     */
    private renderTutorialList(): JSX.Element | JSX.Element[] {
        const respJSX = (<div style={{ height: "40px", textAlign: "center", marginTop: "5vh" }}>Loading...</div>);
        if (this.state.tutorialList.length !== 0) {
            return this.state.tutorialList.map(tut => {
                return(
                    <div className="tutorial-card" key={tut._id} onClick={(e) => {
                        this.handleCardClick(e, tut);
                    }}>
                        <p style={tut === this.props.initialTutorial ? {color: "blue"} : {}}>{tut.name}</p>
                    </div>
                );
            });
        }
        return (respJSX);
    }

    /**
     * Rerenders the tutorial list with a fresh set of data from the API
     */
    private rerenderTutList(): void {
        TutorialDbService.getAllTutorials().then((d) => {
            this.setState({
                tutorialList: d
            });
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
                {this.renderTutorialList()}
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

