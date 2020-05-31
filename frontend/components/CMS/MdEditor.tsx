import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

/**
 * Wraps the editor in another component, to be used when dynamically CSR rendering
 * the editor. The editor requires the window object, so this is needed
 *
 * @author ale8k
 */
export default function MyEditor(): JSX.Element {
    const mdParser: MarkdownIt = new MarkdownIt();

    return (
        <div>
            <MdEditor
                value=""
                style={{ height: '100vh', width: '100%' }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(e) => console.log(e)}
            />
        </div>
    );
}
