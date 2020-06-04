import Head from 'next/head';

import { TITLE } from '../../constants/Seo';

/**
 * Properties for Seo component
 *
 * @property {string} title
 */
export interface IProps {
    title?: string;
}

/**
 * It should be used inside of layout in pages
 * It makes the pages seo friendly
 * It can have <meta/> tags as a children
 *
 * @param {IProps} title
 */
const Seo: React.FC<IProps> = ({ title: dynamicTitle, children }) => (
    <Head>
        <title>{dynamicTitle || TITLE}</title>
        <link rel='icon' href='/favicon.ico' />
        <link
            rel='stylesheet'
            href='https://cdn.rawgit.com/konpa/devicon/df6431e323547add1b4cf45992913f15286456d3/devicon.min.css'
        />
        {children}
    </Head>
);

export default Seo;
