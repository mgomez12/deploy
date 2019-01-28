import React, { Component } from 'react';
import "../../public/css/styles.css"
import {Menu } from 'semantic-ui-react';
import Script from 'react-load-script';
import {get} from './api'

class PlaybackBar extends Component {
    constructor(props) {
        super(props);
        // will have to change server directory at some time

        this.state = {
            audio: '',
            playing: false,
            maxTime: 1,
            time: 0,
            seekValue: null
        };
        this.player = null;
        this.gotSongInfo = false;
        this.device_id = '';
        this.updated = false;
        this.prevSong = this.props.track;
        this.audio = null;
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.onSeekChange = this.onSeekChange.bind(this);
        this.onSeekMouseDown = this.onSeekMouseDown.bind(this);
        this.onSeekMouseUp = this.onSeekMouseUp.bind(this);
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
    }

      componentWillUnmount() {
        clearInterval(this.interval);
      }

      componentDidMount() {
        let player;
        window.onSpotifyWebPlaybackSDKReady = () => {
            player = new Spotify.Player({      // Spotify is not defined until 
            name: 'Web SDK player',            // the script is loaded in 
            getOAuthToken: cb => { cb(this.props.token) }
          });
          player.connect();
          player.addListener('ready', ({ device_id }) => {
              this.device_id = device_id;
              this.player = player;
              console.log(player)
            this.componentDidUpdate()})
      }
      }

    componentDidUpdate() {
        if (this.prevSong !== this.props.track) {
            this.updated = false;
            this.prevSong = this.props.track
            clearInterval(this.interval)
        }
        if (!this.updated && this.props.track !== '' && !this.props.premium) {
            this.setState({
                playing: true,
                maxTime: 30,
                time:0,
                audio: <audio autoPlay src={this.props.track} ref={(audioTag) => {this.audio = audioTag}}/>
            }) 
            this.interval = setInterval(() => this.setState({ time: this.audio.currentTime}), 1000);
            this.updated = true;
        }
        else if (!this.updated && this.player !== null && this.props.premium) {
            let obj = this;
            this.updated = true;
            fetch('https://api.spotify.com/v1/me/player/play?device_id=' + this.device_id, {
              method: 'PUT',
              headers: {
                  'Authorization': 'Bearer ' + this.props.token,
              },
              body: JSON.stringify({
                  'uris': [this.props.track]
              })}).then(() => {
            this.player.getCurrentState().then(info => {
            obj.setState({
                playing: true,
                maxTime: this.props.maxTime,
                time: info.position
            })
        })})
            this.interval = setInterval(() => 
            this.player.getCurrentState().then(info => {this.setState({ time: info.position})}), 1000);
        }
    }

    pause(){
        if (this.state.audio == '') {
            if (this.props.premium) {
                this.player.pause();
                this.setState({playing: false})
                return;
            }
            return
        }
        this.audio.pause()
        this.setState({playing: false})
    }
    play(){
        if (this.state.audio == '') {
            if (this.props.premium) {
                this.player.resume();
                this.setState({playing: true})
            }
            return
        }
        this.audio.play()
        this.setState({playing: true})
    }

    onSeekMouseDown() {
        clearInterval(this.interval);
    }
    onSeekMouseUp() {
        if (this.props.premium) {
            this.player.seek(this.state.seekValue);
            this.interval = setInterval(() => 
            this.player.getCurrentState().then(info => {this.setState({ time: info.position})}), 1000);this.setState({
                time: this.state.seekValue,
                seekValue: null
            })
        }
        else if (this.state.audio !== '') {
        this.audio.currentTime = this.state.seekValue
        this.setState({
            time: this.state.seekValue,
            seekValue: null
        }) 
        this.interval = setInterval(() => this.setState({ time: this.audio.currentTime}), 1000);}
    }
    onSeekChange(e) {
       
        this.setState({
            seekValue: e.target.value
        })
    }

    handleScriptLoad = () => {
        this.componentDidMount()
        
    }

    render() {

        let time=0;
        if (this.state.audio !== '' || this.props.premium) {
           time = this.state.time
        }
        let timeString='0:00'
        if (this.state.audio !== '') {
            const minutes = Math.floor(this.state.time / 60);
            let seconds = Math.floor(this.state.time % 60);
            if (seconds < 10) {seconds = '0' + seconds}
            timeString = minutes + ':' + seconds;
        }
        else if (this.props.premium) {
            const minutes = Math.floor(this.state.time / 1000 / 60);
            let seconds = Math.floor(this.state.time / 1000 % 60);
            if (seconds < 10) {seconds = '0' + seconds}
            timeString = minutes + ':' + seconds;
        }
        return(
        <React.Fragment>
            {this.props.premium ? <Script 
                url="https://sdk.scdn.co/spotify-player.js" 
                onError={this.handleScriptError} 
                onLoad={this.handleScriptLoad}
            /> : 
            this.state.audio}
        <Menu inverted fixed='bottom'>
            {this.state.playing ? 
            <Menu.Item style={{width:'5%'}} icon='pause' onClick={this.pause}></Menu.Item> :
            <Menu.Item style={{width:'5%'}} icon='play' onClick={this.play}></Menu.Item>}
            
            <Menu.Item style={{width:'90%'}}>
            <input className="slider"
                  type='range' min={0} max={this.state.maxTime} step='any'
                  value={this.state.seekValue == null ? time : this.state.seekValue}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
            </Menu.Item>
            <Menu.Item>
                {timeString}
            </Menu.Item>
        </Menu>
        </React.Fragment>)
    }
}

export default PlaybackBar;