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
import ErrorPage from "./pages/error";
import {Segment, TransitionablePortal} from "semantic-ui-react";
import io from "socket.io-client";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {
                access_token: null
            },
            message: '',
            updated: false,
            startSocket: true
        };
        this.socket = io();
    }

    componentDidMount () {
        this.getUser();
    }

    componentDidUpdate() {
        if (this.state.startSocket && this.state.updated) {
            this.socket.on('notification_' + this.state.userInfo._id, notification => {
                this.setState({
                    message: notification
                })
                this.getUser();
            })
            this.setState({
                startSocket: false
            });
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
            <Route path='/u/profile/:user' render = {(props) => <Profile {...props} viewerInfo={userInfo} />} />
            <Route exact path ="/login" component={Login} />
            <Route exact path ='/error' component={ErrorPage}/>
            <Route exact path="/" render = {() => <Main userInfo ={userInfo} updated={this.state.updated} />} />
            <Route path="/song/:songid" render = {(props) => <Song {...props} userInfo ={userInfo}  />} />
            <Route exact path="/album/:albumid" render = {(props) => <Album {...props} userInfo ={userInfo} token ={userInfo.access_token} />}/>
            <Route exact path="/artist/:artistid" render = {(props) => <Artist {...props} userInfo ={userInfo} token ={userInfo.access_token} />}/>
            </Switch>
            <TransitionablePortal onClose={() => {this.setState({message: ''})}} open={ this.state.message === '' ? false : true}>
                <Segment color='teal' style={{left:'80%', position:'fixed', top:'80%', zIndex:'1000'}}>
                {this.stringNotification(this.state.message)}
                </Segment></TransitionablePortal>
        </div>
        );
  }

  stringNotification(notification) {
    if (notification.type == 'sent') {
        return notification.name + ' sent you a friend request'
    }
    else if (notification.type == 'friend') {
        return notification.name + ' confirmed your friend request'
    }
    else {
        return notification.name + ' suggested the song ' + notification.title
    }
  }
  getUser = () => {
    fetch('/api/refresh')
    .then(res => res.json())
    .then(
        userObj => {
            if (userObj._id !== undefined) {
                this.setState({
                    userInfo: userObj,
                    updated: true
                })
            } else {
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