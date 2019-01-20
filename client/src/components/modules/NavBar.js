import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Image, Container, Menu } from 'semantic-ui-react';

class NavBar extends Component{
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null
        };

    }

    render() {
        return(
        <Menu color='teal' inverted>
            <Menu.Item icon='home' href="/"/>
            <Menu.Item name='profile' href='/u/profile/yy8gj7'/>
            <Menu.Item name='songs'/>
            <Menu.Item name='search'/>
            <Menu.Item name='logout' href="/logout" onClick={this.props.logout} position="right"/>
        </Menu>)
}
}

export default NavBar;