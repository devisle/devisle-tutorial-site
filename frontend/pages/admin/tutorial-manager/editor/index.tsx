import dynamic from "next/dynamic";

/**
 * Our editor page, 
 * - Renders the @type {MdEditor} mdEditor in a dynamic instance (CSR instance)
 * 
 * Please note... On subsequent refreshes, this window becomes undefined again despite it being in CSR
 * instance. And again, on further refreshes it becomes defined? 
 * This needs a bit of research and adjusting to make the behaviour behave proper always
 * 
 * @author ale8k
 */
export default function Editor(): JSX.Element {
    const MdEditor = dynamic(
        () => import("../../../../components/CMS/MdEditor")
    );
    return (
        <div className={"Editor"}>
            <MdEditor/>
        </div>
    );
}