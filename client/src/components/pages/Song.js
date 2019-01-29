import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Header, Image, Container, Loader, Grid } from 'semantic-ui-react';
import {get} from "../modules/api";
import SuggestionFormUser from "../modules/SuggestionFormUser"
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
    get('https://api.spotify.com/v1/tracks/' + this.props.match.params.songid, null, function(songData) {
        obj.setState({
            songInfo: songData
        })
    }, null, artistHeader);
    this.gotSongInfo = true;
}

    
render() {
    let image, name, artist, artistid, songId, userId= '';
    if (this.state.songInfo) {
        let href = "/album/" + this.state.songInfo.album.id
        image = <Image centered size="medium" src={this.state.songInfo.album.images[0].url} href={href}/>
        name = this.state.songInfo.name;
        artist =this.state.songInfo.artists[0].name;
        artistid=this.state.songInfo.artists[0].id;
        songId = this.state.songInfo.id
        userId = this.props.userInfo._id


    }

    return(
        <div className='page' style={{'paddingBottom':'45px'}}>
    <section>
    <Grid columns='2' style={{width:'100%'}}>
        <Grid.Column>
    <div style={{'textAlign': 'center', paddingBottom: '10px', paddingTop: '8px'}}>
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
    </div>
    </Grid.Column>
    <Grid.Column>
        <Grid.Row style={{height:'50%'}}>
    {this.gotSongInfo ?<SuggestionFormUser userInfo={this.props.userInfo} track={this.state.songInfo} isTrack={false}/>
            : <Loader active inline />}
            </Grid.Row>
        <Grid.Row>
        {this.gotSongInfo ?<SongComment songId={this.props.match.params.songid}/>: ''}
        {this.gotSongInfo ?<AddComment songId={this.props.match.params.songid} userId={this.props.userInfo._id}/> : '' }
        </Grid.Row>
    </Grid.Column>
    </Grid>
    <div>
    <PlaybackBar token={this.props.userInfo.access_token} 
                 maxTime={this.state.songInfo == null ? 1 : this.state.songInfo.duration_ms}
                 premium={this.props.userInfo.premium} 
                 track={this.state.songInfo == null ? '' : (this.props.userInfo.premium ? this.state.songInfo.uri : this.state.songInfo.preview_url)}/>
    </div>
    </section>
    </div>)
}
}

export default Song;
