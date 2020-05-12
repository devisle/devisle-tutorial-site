import Tutorial from "../classes/Tutorial";

/**
 * A static helper service responsible for:
 *     Fetching/posting tutorials to the API
 *     Creating new tutorials
 *     Modifying tutorials via the API
 * @author ale8k
 */
export default class TutorialService {
    /**
     * {@link tutorial Tutorial}
     * @param {string} name the tutorial name 
     */
    public static createTutorialInstance(name: string) {
        fetch("url", {
            method: "POST"
        });
        new Tutorial(name, "");
    }

}
