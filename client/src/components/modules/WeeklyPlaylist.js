import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Button, Header, Dropdown, Message, Menu } from 'semantic-ui-react';

class WeeklyPlaylist extends Component{
    constructor(props) {
        super(props);
        //takes in userInfo as a prop
    }

    componentDidMount() {
        this.update_playlist()
    }

    update_playlist() {
        this.props.userInfo.suggestions_received;
    }


    handleClick = () => this.updateLog('Button received click with mouse')

    render() {
        return(
            <div>
                <Button animated
                content='Click'
                onClick={this.handleClick}>
                    <Button.Content visible>Check Out Your Playlist of Recent Suggestions!</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
            </div>
        )
}
}

export default WeeklyPlaylist;