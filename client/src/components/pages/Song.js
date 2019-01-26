import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Header, Image, Container, Loader } from 'semantic-ui-react';
import {get} from "../modules/api";
import SuggestionForm from "../modules/SuggestionForm"
import AddComment from "../modules/SongComments/AddComment"
import SongComment from "../modules/SongComments/SongComments"



class Song extends Component {
    constructor(props) {
        super(props);
        // will have to change server directory at some time
        this.socket = io('http://localhost:3000');

        this.state = {
            songInfo: null,
            songid: null,
            token: this.props.userInfo.access_token,
            deviceId: "",
            error: "",
            loggedIn: true,
            playing: false,
            position: 0,
            duration: 1,
        };
        this.gotSongInfo = false;
          // this will later be set by setInterval
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
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
    get('https://api.spotify.com/v1/tracks/' + this.props.match.params.songid, {}, function(songData) {

        console.log('song data in get: ' + songData)
        obj.setState({
            songInfo: songData
        })
    }, null, artistHeader);
    this.gotSongInfo = true;
}

      // when we receive a new update from the player
      onStateChanged(state) {
        // only update if we got a real state
        if (state !== null) {
          const {
            current_track: currentTrack,
            position,
            duration,
          } = state.track_window;
          const playing = !state.paused;
          this.setState({
            position,
            duration,
            playing
          });
        } else {
          // state was null, user might have swapped to another device
          this.setState({ error: "Looks like you might have swapped to another device?" });
        }
      }
      
      createEventHandlers() {
        // problem setting up the player
        this.player.on('initialization_error', e => { console.error(e); });
        // problem authenticating the user.
        // either the token was invalid in the first place,
        // or it expired (it lasts one hour)
        this.player.on('authentication_error', e => {
          console.error(e);
          this.setState({ loggedIn: false });
        });
        // currently only premium accounts can use the API
        this.player.on('account_error', e => { console.error(e); });
        // loading/playing the track failed for some reason
        this.player.on('playback_error', e => { console.error(e); });
      
        // Playback status updates
        this.player.on('player_state_changed', state => this.onStateChanged(state));
      
        // Ready
        this.player.on('ready', async data => {
          let { device_id } = data;
          console.log("Let the music play on!");
          // set the deviceId variable, then let's try
          // to swap music playback to *our* player!
          await this.setState({ deviceId: device_id });
          this.transferPlaybackHere();
        });
      }
      
      checkForPlayer() {
        const { token } = this.state;
        
        // if the Spotify SDK has loaded
        if (window.Spotify !== null) {
          // cancel the interval
          clearInterval(this.playerCheckInterval);
          // create a new player
          this.player = new window.Spotify.Player({
            name: "My Spotify Player",
            getOAuthToken: cb => { cb(token); },
          });
          // set up the player's event handlers
          this.createEventHandlers();
          
          // finally, connect!
          this.player.connect();
        }
      }

      onPlayClick() {
        this.player.togglePlay();
      }
    
      transferPlaybackHere() {
        const { deviceId, token } = this.state;
        // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "device_ids": [ deviceId ],
            // true: start playing music if it was paused on the other device
            // false: paused if paused on other device, start playing music otherwise
            "play": true,
          }),
        });
      }

    
render() {
    let image, name, artist, audio, artistid, songId, userId= '';
    if (this.state.songInfo) {
        image = <Image centered size="medium" src={this.state.songInfo.album.images[0].url}/>
        name = this.state.songInfo.name;
        artist =this.state.songInfo.artists[0].name;
        artistid=this.state.songInfo.artists[0].id;
        audio = <audio autoPlay src={this.state.songInfo.preview_url}/>;
        songId = this.state.songInfo.id
        console.log(songId)
        userId = this.props.userInfo._id
        console.log(userId)


    }
    const {
        token,
        loggedIn,
        error,
        playing
      } = this.state;

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
            <a href={"/album/" + album.id}>{album.name}</a>
            </Header>
            <Header size='medium'>
            <a href={"/artist/" + artistid}>{artist}</a>
            </Header>
            <Header as='h4'>Suggest this song to someone!</Header>
            {this.gotSongInfo ?<SuggestionForm userId={this.props.userInfo._id} track={this.props.match.params.songid} isTrack={false}/>
            : <Loader active inline />}
        </div>
        <div>
            <AddComment songId='2ZWlPOoWh0626oTaHrnl2a' userId='glabred'/>
            <SongComment songId='2ZWlPOoWh0626oTaHrnl2a'/>
        </div>
    </Container>
    </div>)
}
}

export default Song;