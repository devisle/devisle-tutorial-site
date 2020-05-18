import { AppProps } from "next/app";

/**
 * Generic App component which receives a component and pageProps
 * @author shreyas1307
 */

function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default App;
