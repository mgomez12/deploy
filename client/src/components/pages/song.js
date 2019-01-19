import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Header, Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import {get} from "../modules/api";

class Song extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            songInfo: null
        };
        this.gotSongInfo = false;

    }
    componentDidUpdate() {
        if (this.props.token && !this.gotSongInfo) {
        this.renderSongData();
        this.render() }
    }

  
  renderSongData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
    console.log('token: ' + this.props.token)
    get('https://api.spotify.com/v1/tracks/' + this.props.match.params.songid, {}, function(songData) {

        console.log('song data in get: ' + songData)
        obj.setState({
            songInfo: songData
        })
    }, null, artistHeader);
    this.gotSongInfo = true;
}

    
render() {
    let image, name, artist = '';
    if (this.state.songInfo) {
        image = <Image centered size="medium" rounded src={this.state.songInfo.album.images[0].url}/>
        name = this.state.songInfo.name;
        artist =this.state.songInfo.artists[0].name;
    }

    return(
    <Container className="center-screen">
        <Container className="center-text" id="song-image">
            {image}
        </Container>
        <div>
            <Header size='large'>
                {name}
            </Header>
            <Header size='medium'>
                {artist}
            </Header>
        </div>
    </Container>)
}
}

export default Song;