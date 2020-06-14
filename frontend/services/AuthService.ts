import CookieService from './CookieService';

type Credentials = { username: string; password: string };

/**
 * Handles all auth related actions,
 * including whether our current user is currently authenticated.
 *
 * @class
 * @author ale8k
 */
export default class AuthService {
    /**
     * Hits the login endpoint, returns back with a successful or not response
     * Stores the JWT in a cookie (all data required in in the JWT and is returned upon JWT confirmation)
     *
     * @param {Credentials} credentials the users user/pass
     * @returns {Promise<string>} whether or not the user successfully logged in
     */
    public static login(credentials: Credentials): Promise<string> {
        return new Promise(res => {
            fetch('http://127.0.0.1:3000/cms/auth/login', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ ...credentials })
            }).then(resp => {
                if (resp.status === 200) {
                    resp.json().then(data => {
                        const { successfulLogin, jwt } = data;
                        if (successfulLogin) {
                            window.document.cookie = `jwt=${jwt}`;
                            res('successful login');
                        }
                    });
                } else {
                    res('unsuccessful login');
                }
            });
        });
    }

    /**
     * Hits the confirmation endpoint, returns back a few things about the user...
     *  - Their username, for general use
     *  - Their Id, for performing user specific actions
     *  - Their permission level
     *
     * Responses:
     *  - 200: Successful auth confirmation (has the user data in the body ^)
     *  - 401: Unauthorised
     *
     * @param {string} cookiesStr the cookie string from the request
     * @returns {Promise<string>} whether or not the user successfully logged in
     */
    public static confirm(
        cookiesStr: string
    ): Promise<string | { username: string; userId: string; permissionLevel: number }> {
        return new Promise(res => {
            fetch('http://127.0.0.1:3000/cms/auth/confirm', {
                headers: {
                    Authorization: 'Bearer ' + CookieService.getCookie('jwt', cookiesStr)
                }
            }).then(resp => {
                if (resp.status === 200) {
                    resp.json().then(d => res(d as { username: string; userId: string; permissionLevel: number }));
                } else if (resp.status === 401) {
                    res('Unauthorised');
                }
            });
        });
    }
}
