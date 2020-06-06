import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext): Promise<object> {
    // Fetch data from external API
    //const res = await fetch('https://.../data');
    //const data = await res.json();

    /**
     * ALEX: take cookie from context request, verify here, send it in the props
     *
     */

    // Pass data to the page via props
    return { props: {} };
}

/**
 * Our tutorial manager page,
 * - todo
 *
 * @author ale8k
 */
export default function TutorialManager(props): JSX.Element {
    console.log(props);
    return <div className='TutorialManager'>tut manager</div>;
}
