/**
 * Static helper class, responsible for handling all cookie based actions / login
 *
 * @class
 * @author ale8k
 */
export default class CookieService {
    /**
     * Grabs a cookie by it's name
     *
     * @param {string} name the cookie name
     * @returns the cookie
     */
    public static getCookie(name: string, cookiesStr: string): string {
        const cookie = cookiesStr.split(';').map(ckie => {
            const [key, value] = ckie.trim().split('=');
            return { key, value };
        });

        return cookie.find(ckie => ckie.key === name).value;
    }
}
