import { AppProps } from 'next/app';
import '../styles/grid/grids.scss';
import 'react-markdown-editor-lite/lib/index.css';
import 'react-notifications/lib/notifications.css';

import { ThemeContextProvider } from '../components/ThemeProvider/ThemeProvider';
import { GlobalStyles } from '../styles/global.styles';

/**
 * This App component is the top-level component which will be common across all the different pages. You
 * can use this App component to keep state when navigating between pages
 *
 * Notice the 'pageProps', this is actually a generic extention for the alias 'AppProps' and it's just a basic object
 * on assign...
 * Any questions, ask me (Alex)
 *
 * @see [docs]{@link https://nextjs.org/learn/basics/assets-metadata-css/global-styles}
 * @author shreyas1307, ale8k
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
    // We extend the pageProps with global properties we wish to use elsewhere, but have
    // access to in the entire app. You cannot however re-assign them
    return (
        <ThemeContextProvider>
            <GlobalStyles />
            <Component {...pageProps} />
        </ThemeContextProvider>
    );
}
