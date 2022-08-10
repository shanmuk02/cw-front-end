import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalContext } from "../storage";

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  const { globalStore } = useGlobalContext();
  const { authTokens } = globalStore;
  return <Route {...rest} render={(props) => (authTokens ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/login", state: { referer: props.location } }} />)} />;
};

export default PrivateRoute;
