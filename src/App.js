import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
