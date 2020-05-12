import React from "react";
import { PluginComponent } from "react-markdown-editor-lite";

/**
 *
 */
interface IDeletePluginProps {

}

/**
 * React markdown editor lite plugin, enables us to delete a document in progress
 * see {@link Editor Editor} for the Editor instance
 * @author ale8k
 */
export default class DeletePlugin extends PluginComponent<IDeletePluginProps> {
    /**
     * Override for name, must be unqiue
     */
    public static pluginName = "delete";
    /**
     * Where to render, left/right
     */
    public static align = "right";

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <span
                className="button button-type-counter"
                title="Counter"
                onClick={() => console.log("boop")}
            >
                Delete
            </span>
        );
    }
}
