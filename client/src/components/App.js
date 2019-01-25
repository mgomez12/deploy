import React from "react";
import "../public/css/app.css";
import {Route, Switch } from "react-router-dom";
import Profile from "./pages/Profile";
import Root from "./Root";
import Login from "./pages/Login";
import Main from "./pages/Main"
import Song from "./pages/Song";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import NavBar from "./modules/NavBar";
import {Message} from "semantic-ui-react";
import DefaultProfileImage from "./modules/DefaultProfileImage";
import io from "socket.io-client";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {
                access_token: null
            },
            message: '',
            updated: false
        };
        this.socket = io();
    }

    componentDidMount () {
        this.getUser();
    }

    componentDidUpdate() {
        if (this.state.updated) {
            this.socket.on('notification_' + this.state.userInfo._id, notification => {
                console.log('got notification')
                this.setState({
                    message: notification
                })
            })
            this.setState({
                updated: false
            })
        }
    }

  
    render() {
        let userInfo = this.state.userInfo;
        return (
            <div>
            <Switch>
                <Route exact path ='/login' render={() => ''}/>
                <Route exact path = '/' render={() => ''}/>
                <Route path='/' render = {(props) => <NavBar {...props} userInfo={userInfo}/>}/>
            </Switch>
            <Switch>
            <Route exact path='/defaultprofileimage' render = {() => <DefaultProfileImage/>} />
            <Route path='/u/profile/:user' render = {(props) => <Profile {...props} userInfo ={userInfo} viewerInfo={userInfo} />} />
            <Route exact path ="/login" component={Login} />
            <Route exact path="/" render = {() => <Main userInfo ={userInfo} />} />
            <Route path="/song/:songid" render = {(props) => <Song {...props} userInfo ={userInfo}  />} />
            <Route exact path="/album/:albumid" render = {(props) => <Album {...props} userInfo ={userInfo} token ={userInfo.access_token} />}/>
            <Route exact path="/artist/:artistid" render = {(props) => <Artist {...props} userInfo ={userInfo} token ={userInfo.access_token} />}/>
            </Switch>
            {(this.state.message === '' ? "" : <Message content={this.state.message}/>)}
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