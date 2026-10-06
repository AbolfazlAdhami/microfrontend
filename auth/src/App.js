import React from "react";
import { Switch, Route, Router, Redirect } from "react-router-dom";
import { createGenerateClassName, StylesProvider } from "@material-ui/core/styles";

import Signin from "./components/Signin";
import Signup from "./components/Signup";

const generateClassName = createGenerateClassName({
  productionPrefix: "ma",
});

export default ({ history }) => {
  const handleSignIn = () => {
    console.log("Sign in clicked");
  };

  return (
    <StylesProvider generateClassName={generateClassName}>
      <Router history={history}>
        <Switch>
          <Route exact path="/auth/signin">
            <Signin onSignIn={handleSignIn} />
          </Route>

          <Route exact path="/auth/signup">
            <Signup onSignIn={handleSignIn} />
          </Route>

          <Route exact path="/">
            <Redirect to="/auth/signin" />
          </Route>

          <Redirect to="/auth/signin" />
        </Switch>
      </Router>
    </StylesProvider>
  );
};
