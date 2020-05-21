import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

/**
 * Initial Routes for the Front-end
 *
 * @author shreyas1307
 */
export default function index(props) {
	const [categories, setCategories] = useState([
		{ icon: "devicon-javascript-plain", categoryName: "JavaScript" },
		{ icon: "devicon-python-plain", categoryName: "Python" },
	]);
	return (
		<div className="container">
			<Head>
				<title>Dev Isle Tutorials</title>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://cdn.rawgit.com/konpa/devicon/df6431e323547add1b4cf45992913f15286456d3/devicon.min.css"
				></link>
			</Head>

			<main>
				<header>
					<div className="navbar">
						<div className="nav-title">Dev Isle Tutorials</div>
						{/* {user?.isAuthenticated ? (
							<div className="nav-items">Welcome</div>
						) : ( */}
						<div className="nav-items">Login</div>
						{/* )} */}
					</div>
				</header>
				<main>
					<div className="main">
						<div className="w-75">
							<div>
								<input
									type="search"
									className="tutorial-search"
									placeholder="Search a tutorial..."
								/>
							</div>
							<div>
								<div>Categories</div>
							</div>
							<div className="category-list">
								{categories.map((categ, index) => {
									return (
										<div
											key={index}
											className="category-item"
										>
											<div>{categ.categoryName}</div>
											<i className={categ.icon}></i>
										</div>
									);
								})}
							</div>
						</div>
						<div
							className="w-25"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							Ads
						</div>
					</div>
				</main>
			</main>
		</div>
	);
}
