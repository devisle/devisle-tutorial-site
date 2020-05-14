import React from "react";
import { PluginComponent, PluginProps } from "react-markdown-editor-lite";
import { Subject } from "rxjs";

/**
 * Interface will define API local/endpoint to save/retrieve from
 */
interface IPublishPluginProps {
    plugin$: Subject<string>;
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
     * The plugin subject store, emits when to publish back to the editor
     */
    private _plugin$: Subject<string>;

    constructor(props: PluginProps) {
        super(props);

        this._plugin$ = this.getConfig("plugin$");
        this.handleSave = this.handleSave.bind(this);
    }

    /**
     * Emits a "PUBLISH" button click
     */
    private handleSave(): void {
        this._plugin$.next("PUBLISH");
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <span
                className="button button-type-counter"
                title="Counter"
                onClick={() => this.handleSave()}
            >
                Publish
            </span>
        );
    }
}
