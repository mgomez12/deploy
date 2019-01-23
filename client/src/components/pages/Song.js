import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Header, Image, Container, Loader } from 'semantic-ui-react';
import {get} from "../modules/api";
import SuggestionForm from "../modules/SuggestionForm"

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
        if (this.state.songid !== this.props.match.params.songid) {
            this.componentDidMount()
            this.gotSongInfo = false;
        }
        if ((!this.gotSongInfo && this.props.userInfo.access_token)) {
        this.renderSongData(); }
        
    }

  
  renderSongData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
    console.log('token: ' + this.props.access_token)
    get('https://api.spotify.com/v1/tracks/' + this.props.match.params.songid, {}, function(songData) {

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
            <Header as='h4'>Suggest this song to someone!</Header>
            {this.gotSongInfo ?<SuggestionForm userId={this.props.userInfo._id} track={this.props.match.params.songid} isTrack={false}/>
            : <Loader active inline />}
        </div>
    </Container>
    {audio}
    </div>)
}
}

export default Song;