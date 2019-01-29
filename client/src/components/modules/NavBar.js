import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Dropdown, Message, Menu, Sticky } from 'semantic-ui-react';
import SearchBarSpotify from "./SearchBarSpotify"
import io from "socket.io-client";

class NavBar extends Component{
    constructor(props) {
        super(props);
        this.socket = io();
        this.id = 0;
        this.state = {
        };
        this.readNotification = this.readNotification.bind(this)
        this.stringNotification = this.stringNotification.bind(this)
        this.socket.on('connect', () => {})
    }

    readNotification() {
        this.socket.emit('notification_read', this.props.userInfo._id)
    }

    stringNotification(notification) {
        this.id +=1;
        if (notification.type == 'sent') {
            return <Message key={this.id}>{notification.sender + ' sent you a friend request'}</Message>
        }
        else {
            return <Message key={this.id}>{notification.sender + ' confirmed your friend request'}</Message>
        }
    }
    render() {
        let idString = 'me'
        let notifications = []
        if (this.props.userInfo.access_token !== null) {
            idString = this.props.userInfo._id
            notifications = this.props.userInfo.notifications
        }
        return(
        <Menu fixed='top' color='teal' inverted>
            <Menu.Item icon='home' href="/"/>
            <Menu.Item name='profile' href={'/u/profile/' + idString}/>
            <Menu.Item name='songs' href='/song/2ZWlPOoWh0626oTaHrnl2a'/>
            <Menu.Item name='albums' href='/album/3mH6qwIy9crq0I9YQbOuDf'/>
            <Menu.Item>
              <SearchBarSpotify history={this.props.history} userInfo={this.props.userInfo}/>
            </Menu.Item>
            <Menu.Menu position="right">
                <Dropdown item icon='bell' onClick ={this.readNotification}>
                    <Dropdown.Menu>
                        {notifications.map(this.stringNotification)}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
            <Menu.Item name='logout' href="/logout" onClick={this.props.logout}/>
        </Menu>)
}
}

export default NavBar;