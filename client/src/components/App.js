import React from "react";
import "../public/css/app.css";
import {Route, Switch, withRouter } from "react-router-dom";
import Profile from "./pages/profile";
import Root from "./Root";
import Login from "./pages/login";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null
        };
    }

    componentDidMount () {
        
    }
  
    render() {
        return (
        <div>
            <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path='/profile/:user' component={Profile} />}/>
            </Switch>
        </div>
        )
    ;
  }
}

export default App;