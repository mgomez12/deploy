import React, { Component } from 'react';
import "../../public/css/styles.css"
import {Menu } from 'semantic-ui-react';

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
        this.gotSongInfo = false;
        this.updated = false;
        this.audio = null;
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.onSeekChange = this.onSeekChange.bind(this);
        this.onSeekMouseDown = this.onSeekMouseDown.bind(this);
        this.onSeekMouseUp = this.onSeekMouseUp.bind(this);
    }

      componentWillUnmount() {
        clearInterval(this.interval);
      }

    componentDidUpdate() {
        if (!this.updated && this.props.track !== '') {
            this.setState({
                playing: true,
                maxTime: 30,
                time:0,
                audio: <audio autoPlay src={this.props.track} ref={(audioTag) => {this.audio = audioTag}}/>
            }) 
            this.interval = setInterval(() => this.setState({ time: this.audio.currentTime}), 1000);
            this.updated = true;
        }
    }

    pause(){
        if (this.state.audio == '') {
            return
        }
        this.audio.pause()
        this.setState({playing: false})
    }
    play(){
        if (this.state.audio == '') {
            return
        }
        this.audio.play()
        this.setState({playing: true})
    }

    onSeekMouseDown() {
        clearInterval(this.interval);
    }
    onSeekMouseUp() {
        this.audio.currentTime = this.state.seekValue
        this.setState({
            time: this.state.seekValue,
            seekValue: null
        })
        this.interval = setInterval(() => this.setState({ time: this.audio.currentTime}), 1000);
    }

    onSeekChange(e) {
       
        this.setState({
            seekValue: e.target.value
        })
    }

    render() {

        let time=0;
        if (this.state.audio !== '') {
           time = this.state.time
        }
        let timeString='0:00'
        if (this.state.audio !== '') {
            const minutes = Math.floor(this.state.time / 60);
            let seconds = Math.floor(this.state.time % 60);
            if (seconds < 10) {seconds = '0' + seconds}
            timeString = minutes + ':' + seconds;
        }
        return(
        <React.Fragment>
            {this.state.audio}
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