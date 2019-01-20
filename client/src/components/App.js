import React from "react";
import "../public/css/app.css";
import {Route, Switch, withRouter, Redirect } from "react-router-dom";
import { Menu } from "semantic-ui-react"
import Profile from "./pages/Profile";
import Root from "./Root";
import Login from "./pages/Login";
import Main from "./pages/Main"
import Song from "./pages/Song";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {
                name: null,
                access_token: null
            }
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
            <Menu color='teal' inverted>
                <Menu.Item name='profile' href='/u/profile/yy8gj7'/>
                <Menu.Item name='song'/>
            </Menu>
            <Switch>
            <Route path='/u/profile/:user' component={Profile}/>
            <Route exact path ="/login" render = {() => <Login userInfo={userInfo} />} />
            <Route exact path="/" render = {() => <Main userInfo ={userInfo} />} />
            <Route exact path="/song/:songid" render = {(props) => <Song {...props} token ={userInfo.access_token} />} />
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