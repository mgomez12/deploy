import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Image, Container} from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import {get} from "../modules/api.js";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');
        this.isUpdated = false;

        this.state = {
            userInfo: this.props.userInfo,
            top_songs: 'top songs: ',
            latestPost: null,
            id: null,
        };
    
    }

    renderUserData(profile) {
        let songs = this.top_songs
        var artistHeader = [['Authorization', 'Bearer ' + profile.access_token]];
        get('https://api.spotify.com/v1/me/top/tracks', {'limit': '10'}, function(songJson) {
            
            songJson.items.map( (songInfo) => {
                songs += songInfo.name + ", "
            })
            console.log(songs);
        }, null, artistHeader);
        this.setState({
            top_songs: songs
        })
        this.isUpdated = true;
        
    }

    componentDidMount() {
        this.renderUserData(this.state.userInfo);
  }

  render() {
      console.log(this.state.userInfo)
    if (this.isUpdated) {
        return (
        <Container>
            <Image centered circular size='medium' src={nick_pic}/>
        </Container>
        );
        } else{
        return(
         <div></div>
    )
    }

}
}
export default Profile;