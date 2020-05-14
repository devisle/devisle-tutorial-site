import React from "react";
import { PluginComponent, PluginProps } from "react-markdown-editor-lite";
import { Subject } from "rxjs";

/**
 *
 */
interface IDeletePluginProps {
    plugin$: Subject<string>;
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
     * The plugin subject store, emits when to delete back to the editor
     */
    private _plugin$: Subject<string>;

    constructor(props: PluginProps) {
        super(props);

        this._plugin$ = this.getConfig("plugin$");
    }

    /**
     * Emits a "DELETE" button click
     */
    private handleDeleteDraft(): void {
        this._plugin$.next("DELETE");
    }

    /**
     * Render
     */
    public render(): JSX.Element {
        return (
            <span
                className="button button-type-counter"
                title="Counter"
                onClick={() => this.handleDeleteDraft()}
            >
                | Delete Draft |
            </span>
        );
    }
}
