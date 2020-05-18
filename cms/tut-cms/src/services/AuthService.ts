type LoginCheckResp = { username: string, userId: string };

/**
 * Handles login of a CMS user, including:
 *  - Fresh logins
 *  - Token confirmation
 *  - @todo token timer expiry
 *
 * @author ale8k
 */
export default class AuthService {
    /**
     * A reference to the parent component method of the application will be assigned here
     * upon component construction, so we can be sure it'll always be assigned
     * Used to update the users login state if any 401's occur
     */
    public static updateUserLoginState: Function;

    /**
     * Performs a fresh login attempt, if successful,
     * stores the jwt in the document cookie list
     * @example
     * document.cookie = `jwt=${jwt}`
     * If however, the login fails, please note the the clearAllCookies() will be called
     * @see {@link clearAllCookies AuthService#clearAllCookies}
     * 
     * 
     * @async
     * @param {string} attemptedUsername
     * @param {string} password 
     */
    public static async login(attemptedUsername: string, password: string): Promise<void> {
        return await fetch(process.env.REACT_APP_SERVER_URI + "/cms/login/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ attemptedUsername, password })
        }).then(d => {
            return d.json();
        }).then(({ successfulLogin, jwt }) => {
            if (successfulLogin) {
                // Store the JWT
                document.cookie = `jwt=${jwt}`;
            } else {
                // Wipe out every cookie current assigned to them
                AuthService.clearAllCookies();
            }
        });
    }

    /**
     * Checks if the user is logged in
     * Sends the currently stored token, if any, via the 'Bearer' auth scheme
     * @see {@link https://tools.ietf.org/html/rfc6750}
     */
    public static async checkUserIsLoggedIn(): Promise<LoginCheckResp> {
        return await fetch(process.env.REACT_APP_SERVER_URI + "/cms/login/confirm/", {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${AuthService.getCookie("jwt")}`,
                "Accept": "application/json"
            }
        }).then(d => {
            return d.json() as Promise<LoginCheckResp>;
        });
    }

    /**
     * Completely clears all cookies from N domain, and all N domain's variants
     */
    private static clearAllCookies(): void {
        const cookies = document.cookie.split("; ");
        for (let c = 0; c < cookies.length; c++) {
            const d = window.location.hostname.split(".");
            while (d.length > 0) {
                const cookieBase = encodeURIComponent(
                    cookies[c].split(";")[0].split("=")[0]
                ) + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" + d.join(".") + " ;path=";
                const p = window.location.pathname.split("/");
                document.cookie = cookieBase + "/";
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join("/");
                    p.pop();
                }
                d.shift();
            }
        }
    }

    /**
     * Gets a cookie by a given key
     * 
     * @param {string} name the cookie name 
     * @returns {string | undefined} the value of the cookie
     */
    public static getCookie(name: string): string | undefined {
        const cookieMatch = document.cookie.match(
            new RegExp(
                "(^| )" 
                + name + 
                "=([^;]+)"
            )
        );

        if (cookieMatch) {
            return cookieMatch[2];
        }
    }

}
