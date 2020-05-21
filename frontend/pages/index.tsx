import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import {Layout, Seo} from '../components'

/**
 * Get tutorials 
 * 
 * @todo typescript types
 * @returns tutorials
 */
export const getServerSideProps = async () => {
    const response = await fetch('http://localhost:3000/api/getTutorial');
    return {
        props: {
            tutorials: await response.json()
        }
    }
}

/**
 * Index Page - renders on '/' route
 *
 * @author shreyas1307, rakeshshubhu
 */
export default function index(props) {
    const [categories, setCategories] = useState(props.tutorials);
    return (
        <Layout>     
            <Seo/>
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
        </Layout>
    );
}
