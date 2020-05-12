import Tutorial from "../classes/Tutorial";

/**
 * A static helper service responsible for:
 *     Fetching/posting tutorials to the API
 *     Creating new tutorials
 *     Modifying tutorials via the API
 * @author ale8k
 */
export default class TutorialDbService {
    /**
     * Creates an empty {@link tutorial Tutorial} with the given name
     * @param {string} name the tutorial name 
     */
    public static createTutorial(name: string): Promise<Response> {
        return fetch("http://127.0.0.1:3000/tutorial", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new Tutorial(name, "").toJSON())
        });
    }

}
