import Head from "next/head";
import Link from "next/link";

/**
 * Initial Routes for the Front-end
 * @author shreyas1307
 */

export default function Home() {
	return (
		<div className="container">
			<Head>
				<title>Dev Isle Tutorials</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<ul>
					<li>
						<Link
							as="/javascript/variables"
							href="/[category]/[tutorial]"
						>
							JavaScript Variables
						</Link>
					</li>
					<li>
						<Link
							as="/javascript/functions"
							href="/[category]/[tutorial]"
						>
							JavaScript functions
						</Link>
					</li>
				</ul>
			</main>
		</div>
	);
}
