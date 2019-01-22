import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Header, Image, Container, Menu } from 'semantic-ui-react';
import {get} from "../modules/api";
import NavBar from "../modules/NavBar";

class Song extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');
        // will have to change server directory at some time

        this.state = {
            songInfo: null,
            songid: null
        };
        this.gotSongInfo = false;

    }
    componentDidMount() {
        const song = this.props.match.params.songid
        this.setState({
            songid: song
        })
    }
    componentDidUpdate() {
        if (this.props.token && !this.gotSongInfo) {
        this.renderSongData(); }
    }

  
  renderSongData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
    console.log('token: ' + this.props.token)
    get('https://api.spotify.com/v1/tracks/' + this.state.songid, {}, function(songData) {

        console.log('song data in get: ' + songData)
        obj.setState({
            songInfo: songData
        })
    }, null, artistHeader);
    this.gotSongInfo = true;
}

    
render() {
    let image, name, artist, audio, artistid = '';
    if (this.state.songInfo) {
        image = <Image centered size="medium" src={this.state.songInfo.album.images[0].url}/>
        name = this.state.songInfo.name;
        artist =this.state.songInfo.artists[0].name;
        artistid=this.state.songInfo.artists[0].id;
        audio = <audio autoPlay src={this.state.songInfo.preview_url}/>;
    }

    return(
        <div>
    <NavBar userInfo={this.props.userInfo}/>
    <Container className="center-screen">
        <Container className="center-text" id="song-image">
            {image}
        </Container>
        <div>
            <Header size='large'>
                {name}
            </Header>
            <Header size='medium'>
            <a href={"/artist/" + artistid}>{artist}</a>
            </Header>
        </div>
    </Container>
    {audio}
    </div>)
}
}

export default Song;