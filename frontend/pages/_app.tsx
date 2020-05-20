import { AppProps } from "next/app";
import "../styles/global.scss";

/**
 * This App component is the top-level component which will be common across all the different pages. You 
 * can use this App component to keep state when navigating between pages
 * 
 * @see [docs]{@link https://nextjs.org/learn/basics/assets-metadata-css/global-styles}
 * @author shreyas1307
 */
export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
