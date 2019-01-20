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
        return(<Menu color='teal' inverted>
        <Menu.Item name='profile' href='/u/profile/yy8gj7'/>
        <Menu.Item name='song'/>
</Menu>)
}
}

export default NavBar;