import React from "react";
import "../public/css/app.css";
import {Route, Switch, withRouter, Redirect } from "react-router-dom";
import Profile from "./pages/Profile";
import Root from "./Root";
import Login from "./pages/Login";
import Main from "./pages/Main"
import { get } from "./modules/api"

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null
        };
    }

    componentWillMount () {
        this.getUser()
    }

    updateUser = (info) => {
        this.setState(
            userInfo= info
        )
    }
  
    render() {
        let userInfo = this.state.userInfo;
        return (
            
        <div>
            <Switch>
            <Route path='/u/profile/:user' render = {() => <Profile userInfo={userInfo} />} />/>
            <Route exact path ="/login" render = {() => <Login userInfo={userInfo} />} />
            <Route exact path="/" render = {() => <Main userInfo ={userInfo} />} />
            </Switch>
        </div>
        )
    ;
  }

  getUser = () => {    
    fetch('/api/whoami')
    .then(res => res.json())
    .then(
        userObj => {
            if (userObj._id !== undefined) {
                this.setState({ 
                    userInfo: userObj
                });
                console.log('set object')

            } else {
                this.setState({ 
                    userInfo: null
                });
                console.log('null object')
            }
            return userObj
        }
    )
    };
}

export default App;