import Tutorial from "../classes/Tutorial";
import ITutorial from "../interfaces/ITutorial";

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
            body: JSON.stringify(new Tutorial(name, "", "").toJSON())
        });
    }

    /**
     * Gets all tutorials
     * @returns returns a resolved promise with {@link tutorialArr Tutorial[]}
     * Note, this can be undefined in the case of DB failure.
     */
    public static getAllTutorials(): Promise<ITutorial[]> {
        return fetch("http://127.0.0.1:3000/tutorial", {
            method: "GET",
            mode: "cors",
        }).then((d) => d.json());
    }

    /**
     * Updates a tutorial
     * @param {Tutorial} tutorial the tutorial to update 
     */
    public static saveTutorial(tutorial: ITutorial): void {
        if (window.confirm("Are you sure you want to save? (This will overwrite the tutorial)")) {
            fetch("http://127.0.0.1:3000/tutorial", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tutorial)
            });
        } else {
            console.log("Aborted saved");
        }
    }

}
