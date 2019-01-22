import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Input, Image, Container, Menu } from 'semantic-ui-react';
import SearchBar from "../modules/SearchBar"

class NavBar extends Component{
    constructor(props) {
        super(props);
        console.log(this.props.userInfo)
        this.state = {
            userInfo: null
        };

    }

    render() {
        return(
        <Menu color='teal' inverted>
            <Menu.Item icon='home' href="/"/>
            <Menu.Item name='profile' href='/u/profile/glabred'/>
            <Menu.Item name='songs' href='/song/2ZWlPOoWh0626oTaHrnl2a'/>
            <Menu.Item name='albums' href='/album/3mH6qwIy9crq0I9YQbOuDf'/>
            <Menu.Item>
              <SearchBar userInfo={this.props.userInfo}/>
            </Menu.Item>
            <Menu.Item name='logout' href="/logout" onClick={this.props.logout} position="right"/>
        </Menu>)
}
}

export default NavBar;