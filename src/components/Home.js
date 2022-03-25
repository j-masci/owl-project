import React from "react";
import Layout from "./Layout";

const Home = () => {
    return (
        <Layout>
            <h2>Home</h2>
            <p><a href="https://github.com/j-masci" target="_blank">https://github.com/j-masci</a></p>
            <p>View the list of users: <a href="/users">here</a>.</p>
            <p>Make sure you seeded the database first. See the readme file.</p>
        </Layout>
    )
}

export default Home;