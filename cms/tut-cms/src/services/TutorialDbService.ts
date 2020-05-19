import Tutorial from "../classes/Tutorial";
import ITutorial from "../interfaces/ITutorial";
import AuthService from "./AuthService";

type MongoDbResponse = { n: number, nModified: number, ok: number };

/**
 * A static helper service responsible for:
 *  - Fetching/posting tutorials to the API
 *  - Creating new tutorials
 *  - Modifying tutorials via the API
 * @author ale8k
 */
export default class TutorialDbService {
    
    /**
     * Creates an empty {@link tutorial Tutorial} with the given name
     *
     * @async
     * @param {string} category the tutorial category
     * @param {string} name the tutorial name 
     * @returns {Promise<Response>} JSON response
     */
    public static createTutorial(category: string, name: string): Promise<string> {
        return TutorialDbService.sendRequest<string>("POST", new Tutorial(category, name, "", "").toJSON());
    }

    /**
     * Gets all tutorials from the API
     *
     * @async
     * @returns returns a resolved promise with {@link tutorialArr Tutorial[]}
     * Note, this can be undefined in the case of DB failure.
     */
    public static getAllTutorials(): Promise<ITutorial[]> {
        return TutorialDbService.sendRequest<ITutorial[]>("GET");
    }

    /**
     * Updates a tutorial
     *
     * @async
     * @param {Tutorial} tutorial the tutorial to update 
     * @returns {Promise<MongoDbResponse>} returns mongodb response of an update in object
     */
    public static saveTutorial(tutorial: ITutorial): Promise<MongoDbResponse> {
        return TutorialDbService.sendRequest<MongoDbResponse>("PUT", tutorial);
    }

    /**
     * Gets the list of categories to select from
     * @todo Create endpoint of categories stored
     */
    public static getCategories(): string[] {
        return [
            "Programming",
            "Something else"
        ];
    }

    /**
     * Sends a fetch request with specified data / no data
     * If the users isn't authenticated, updates the users login state
     * 
     * @async
     * @param {string} httpMethod the HTTP method to use in the request 
     * @param {object} data the data to pass in the body, if any 
     * @returns {Promise<T>} a promise with a variable data type
     */
    private static sendRequest<T>(httpMethod: string, data?: object): Promise<T> {
        const options: RequestInit = {
            method: httpMethod,
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AuthService.getCookie("jwt")}`,
                "Accept": "application/json"
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        return new Promise((res) => {
            fetch("http://127.0.0.1:3000/tutorial", options).then(v => {
                if (v.status === 401) {
                    AuthService.updateUserLoginState();
                } else {
                    res(v.json());
                }
            });
        });
    }

}
