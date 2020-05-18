import React, { Component, FormEvent, RefObject } from "react";
import AuthService from "../../services/AuthService";

interface ILoginProps {
    updateUserLoginState: Function;
}

/**
 * Login screen
 * @author ale8k
 */
export default class Login extends Component<ILoginProps, {}> {

    constructor(props: ILoginProps) {
        super(props);

        this.attemptLogin = this.attemptLogin.bind(this);
    }

    /**
     * Attempts to log a CMS user into the CMS
     *
     * @param {FormEvent<HTMLFormElement>} event the event returned from a submit click
     * @param {RefObject<HTMLInputElement>[]} inputRefs an array containing each input element ref object
     */
    private async attemptLogin(event: FormEvent<HTMLFormElement>, [usernameRef, passwordRef]: RefObject<HTMLInputElement>[]): Promise<void> {
        event.preventDefault();
        const username = usernameRef.current?.value as string;
        const password = passwordRef.current?.value as string;
        await AuthService.login(username, password).then(loggedIn => {
            this.props.updateUserLoginState();
        });
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
