import React, { Component, FormEvent, RefObject } from "react";
import UserLoginHandler from "../../handlers/UserLoginHandler";

/**
 * Login screen
 * @author ale8k
 */
export default class Login extends Component<{}, {}> {

    constructor(props: {}) {
        super(props);

        this.attemptLogin = this.attemptLogin.bind(this);
    }

    /**
     * Attempts to log a CMS user into the CMS
     * @param {FormEvent<HTMLFormElement>} event the event returned from a submit click
     * @param {RefObject<HTMLInputElement>[]} inputRefs an array containing each input element ref object
     */
    private async attemptLogin(event: FormEvent<HTMLFormElement>, [usernameRef, passwordRef]: RefObject<HTMLInputElement>[]): Promise<void> {
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        console.log(process.env.REACT_APP_SERVER_URI);
        const response = await fetch(process.env.REACT_APP_SERVER_URI + "/cms/login/", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password })
        }).then(d => {
            return d.json();
        }).then(console.log);
        
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        const usernameRef: RefObject<HTMLInputElement> = React.createRef();
        const passwordRef: RefObject<HTMLInputElement> = React.createRef();
        return (
            <div className="Login">
                <form onSubmit={(e) => this.attemptLogin(e, [usernameRef, passwordRef])}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label>Username:</label>
                        <input ref={usernameRef} type="text" id="username" name="username" />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label>Password:</label>
                        <input ref={passwordRef} type="password" id="pass" name="password"/>
                    </div>

                    <input type="submit" value="Sign in"></input>
                </form>
            </div>
        );
    }

}
