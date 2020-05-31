/**
 * Used in the projection by the PublicTutorialService for grabbing the public
 * details of a given tutorial. This will ultimately be transformed into a full-fledged
 * PUBLIC tutorial.
 *
 * @author ale8k
 */
export default interface IProjectedTutorial {
    name: string;
    html: string;
    category: string;
    authorName: string;
    isAvailable: boolean;
}
