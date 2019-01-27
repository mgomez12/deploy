import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Header, Image, Container, Loader, Menu } from 'semantic-ui-react';
import {get} from "../modules/api";
import SuggestionForm from "../modules/SuggestionForm"
import AddComment from "../modules/SongComments/AddComment"
import SongComment from "../modules/SongComments/SongComments"
import PlaybackBar from "../modules/PlaybackBar"


class Song extends Component {
    constructor(props) {
        super(props);
        // will have to change server directory at some time

        this.state = {
            songInfo: null,
            songid: null
        };
        this.gotSongInfo = false;
        this.audio='';
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
    console.log('token: ' + this.props.userInfo.access_token)
    get('https://api.spotify.com/v1/tracks/' + this.props.match.params.songid, null, function(songData) {

        console.log('song data in get: ' + songData)
        obj.setState({
            songInfo: songData
        })
    }, null, artistHeader);
    this.gotSongInfo = true;
}

    
render() {
    let image, name, artist, artistid, songId, userId= '';
    if (this.state.songInfo) {
        image = <Image centered size="medium" src={this.state.songInfo.album.images[0].url}/>
        name = this.state.songInfo.name;
        artist =this.state.songInfo.artists[0].name;
        artistid=this.state.songInfo.artists[0].id;
        songId = this.state.songInfo.id
        console.log(songId)
        userId = this.props.userInfo._id
        console.log(userId)


    }

    return(
        <div className='page' style={{'paddingBottom':'45px'}}>
    <div style={{'textAlign': 'center', paddingBottom: '10px'}}>
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
    </div>
    <div>
        {this.gotSongInfo ?<AddComment songId={this.props.match.params.songid} userId={this.props.userInfo._id}/> : <Loader active inline />}
        <Container>
            {this.gotSongInfo ?<SongComment songId={this.props.match.params.songid}/>: <Loader active inline />}
        </Container>
    </div>
    <div>
    <PlaybackBar token={this.props.userInfo.access_token} maxTime={this.state.songInfo == null ? 1 : this.state.songInfo.duration_ms} premium={this.props.userInfo.premium} track={this.state.songInfo == null ? '' : this.state.songInfo.preview_url}/>
    </div>
    </div>)
}
}

export default Song;
