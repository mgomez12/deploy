import React from "react";
import "../public/css/app.css";
import {Route, Switch, withRouter, Redirect } from "react-router-dom";
import { Menu } from "semantic-ui-react"
import Profile from "./pages/Profile";
import Root from "./Root";
import Login from "./pages/Login";
import Main from "./pages/Main"
import Song from "./pages/Song";
import Album from "./pages/Album";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null,
            updated: false
        };
    }

    componentDidMount () {
        this.getUser();
        console.log(this.state.userInfo)
    }

  
    render() {
        let userInfo = this.state.userInfo;
        return (
            <div>
            <Switch>
            <Route path='/u/profile/:user' component={Profile}/>
            <Route exact path ="/login" component={Login} />} />
            <Route exact path="/" render = {() => <Main userInfo ={userInfo} />} />
            <Route path="/song/:songid" render = {() => <Song token ={userInfo.access_token} />} />
            
            <Route exact path="/album/:albumid" render = {() => <Album token ={userInfo.access_token} />}/>
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
                console.log('set object')
                this.setState({
                    userInfo: userObj,
                    updated: true
                })
            } else {
                console.log('returned null user object')
                this.setState({
                    userInfo: {
                    name: null,
                    access_token: null
                    },
                    updated: true
                })
            }
        }
    )
    };
}

export default App;