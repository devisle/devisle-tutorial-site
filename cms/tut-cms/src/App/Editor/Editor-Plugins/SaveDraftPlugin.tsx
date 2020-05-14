import React from "react";
import { PluginComponent, PluginProps } from "react-markdown-editor-lite";
import { Subject } from "rxjs";

/**
 * Interface will define API local/endpoint to save/retrieve from
 */
interface ISaveDraftPluginProps {
    plugin$: Subject<string>;
}

/**
 * React markdown editor lite plugin, enables us to save a document in progress
 * see {@link Editor Editor} for the Editor instance
 * @author ale8k
 */
export default class SaveDraftPlugin extends PluginComponent<ISaveDraftPluginProps> {
    /**
     * Override for name, must be unqiue
     */
    public static pluginName = "draft";
    /**
     * Where to render, left/right
     */
    public static align = "right";
    /**
     * The plugin subject store, emits when to save back to the editor
     */
    private _plugin$: Subject<string>;

    constructor(props: PluginProps) {
        super(props);

        this._plugin$ = this.getConfig("plugin$");
        this.handleSave = this.handleSave.bind(this);
    }

    /**
     * Emits a "SAVE" button click
     */
    private handleSave(): void {
        this._plugin$.next("SAVE");
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
                Save Draft
            </span>
        );
    }
}
