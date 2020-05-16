import Head from "next/head";

export default function Home() {
	return (
		<div className="container">
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<ul>
					<li>
						<a href="/tutorials">Tutorials Page</a>
					</li>
					<li>
						<a href="/tutorials/tutorial1">Tutorial 1</a>
					</li>
				</ul>
			</main>
		</div>
	);
}
