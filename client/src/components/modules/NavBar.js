import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Header, Image, Dropdown, Message, Menu, Sticky } from 'semantic-ui-react';
import SearchBarSpotify from "./SearchBarSpotify"
import io from "socket.io-client";
import basic_llama from "../../public/assets/basic_llama.png";


class NavBar extends Component{
    constructor(props) {
        super(props);
        this.socket = io();
        this.id = 0;
        this.state = {
            icon: 'bell'
        };
        this.update = true;
        this.readNotification = this.readNotification.bind(this)
        this.stringNotification = this.stringNotification.bind(this)
        this.socket.on('connect', () => {})
    }

    componentDidUpdate() {
        if (this.update && this.props.userInfo.access_token !== null && this.props.userInfo.unread_notifications) {
            if (this.interval) {
                clearInterval(this.interval)
            }
            this.interval = setInterval(() => {this.flashNotification()}, 1000)
        }
        this.update = true;
    }
    readNotification() {
        clearInterval(this.interval)
        this.socket.emit('notification_read', this.props.userInfo._id)
    }

    flashNotification() {
        this.update = false;
        this.setState({icon:(this.state.icon == 'bell' ? 'bell outline' : 'bell')})
    }

    stringNotification(notification) {
        this.id +=1;
        if (notification.type == 'sent') {
            return <Message key={this.id}>
            <a href={'/u/profile/' + notification.sender}>{notification.name + ' '}</a>
            sent you a friend request
            </Message>
        }
        else if (notification.type == 'friend') {
            return <Message key={this.id}>
            <a href={'/u/profile/' + notification.sender}>{notification.name + ' '}</a>
            confirmed your friend request
            </Message>
        }
        else {
            return <Message key={this.id}>
            {(notification.sender == 'anonymous') ? notification.name + ' ': <a href={'/u/profile/' + notification.sender}>{notification.name + ' '}</a>}
            suggested the song
            <a href={'/song/' + notification.url}>{' ' + notification.title}</a>
            !
            </Message>
        }
    }
    render() {
        let idString = 'me'
        let notifications = []
        if (this.props.userInfo.access_token !== null) {
            idString = this.props.userInfo._id
            length = this.props.userInfo.notifications.length
            notifications = this.props.userInfo.notifications.slice(length - 10, length)
        }
        return(
        <Menu fixed='top' color='teal' inverted>
            <Menu.Item name="groove" href="/">
                <Header>
                    <i>groove</i>
                </Header>
                <Image size='mini' src={basic_llama}/>
             </Menu.Item>
            <Menu.Item name='profile' href={'/u/profile/' + idString}/>
            <Menu.Item name='songs' href='/song/2ZWlPOoWh0626oTaHrnl2a'/>
            <Menu.Item name='albums' href='/album/3mH6qwIy9crq0I9YQbOuDf'/>
            <Menu.Item>
              <SearchBarSpotify history={this.props.history} userInfo={this.props.userInfo}/>
            </Menu.Item>
            <Menu.Menu position="right">
                <Dropdown item icon={this.state.icon} onClick ={this.readNotification}>
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