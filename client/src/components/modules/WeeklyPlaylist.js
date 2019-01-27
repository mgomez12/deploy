import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Icon, Button, Header, Dropdown, Message, Menu } from 'semantic-ui-react';

class WeeklyPlaylist extends Component{
    constructor(props) {
        super(props);
        //takes in history and userInfo as a prop
    }

    componentDidMount() {
        this.update_playlist()
    }

    update_playlist() {
        const uri_list = this.props.userInfo.suggestions_received;
        const playlist_id = this.props.userInfo.suggestion_playlist_id;
        fetch("https://api.spotify.com/v1/playlists/"+ playlist_id+"/tracks", {
            method: 'PUT',
            headers: {
                'Authorization': "Bearer " + this.props.userInfo.access_token,
                'Content-type': 'application/json'
            },
            body: {
                public: true,
                uris: uri_list
            }
          }).then(res => res.json()).then(res => console.log(res));
    }


    handleClick = () => {
        this.props.history.push('https://open.spotify.com/playlist/'+this.props.userInfo.suggestion_playlist_id);
    }

    render() {
        return(
            <div>
                <Button animated
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