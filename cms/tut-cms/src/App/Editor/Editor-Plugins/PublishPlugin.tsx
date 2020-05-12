import React from "react";
import { PluginComponent } from "react-markdown-editor-lite";

/**
 * Interface will define API local/endpoint to save/retrieve from
 */
interface IPublishPluginProps {

}

/**
 * React markdown editor lite plugin, enables us to publish a document
 * see {@link Editor Editor} for the Editor instance
 * @author ale8k
 */
export default class SavePlugin extends PluginComponent<IPublishPluginProps> {
    /**
     * Override for name, must be unqiue
     */
    public static pluginName = "publish";
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
                Publish
            </span>
        );
    }
}
