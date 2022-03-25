import Home from "./components/Home";
import Users from "./components/Users";
import {Router as ReachRouter} from "@reach/router";
import React from "react";

const Router = () => {
    return(
        <ReachRouter>
            <Home path="/"/>
            <Users path="/users"/>
            <Users path="/users/new" newUser={true} />
        </ReachRouter>
    )
}

export default Router;
