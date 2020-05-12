import React from "react";
import { PluginComponent, PluginProps } from "react-markdown-editor-lite";
import { Subject } from "rxjs";

/**
 * Interface will define API local/endpoint to save/retrieve from
 */
interface ISavePluginProps {
    plugin$: Subject<string>;
}

/**
 * React markdown editor lite plugin, enables us to save a document in progress
 * see {@link Editor Editor} for the Editor instance
 * @author ale8k
 */
export default class SavePlugin extends PluginComponent<ISavePluginProps> {
    /**
     * Override for name, must be unqiue
     */
    public static pluginName = "save";
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
     * 
     */
    private handleSave(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
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
                onClick={(e) => this.handleSave(e)}
            >
                Save
            </span>
        );
    }
}
