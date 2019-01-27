import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Dropdown, Message, Menu, Sticky } from 'semantic-ui-react';
import SearchBarSpotify from "./SearchBarSpotify"

class NavBar extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    stringNotification(notification) {
        if (notification.type == 'sent') {
            return <Message>{notification.sender + ' sent you a friend request'}</Message>
        }
        else {
            return <Message>{notification.sender + ' confirmed your friend request'}</Message>
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
                <Dropdown item icon='bell'>
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