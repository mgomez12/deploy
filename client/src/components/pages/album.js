import React, { Component } from 'react';
//import { Link } from 'react-router';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Segment, Header, Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import {get} from "../modules/api";
import NavBar from "../modules/NavBar"

class Album extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');
        // will have to change server directory at some time
        this.state = {
            albumInfo: null,
        };
        this.gotAlbumInfo = false;

    }
    componentDidMount() {
        this.renderAlbumData();
    }
    componentDidUpdate() {
        if (this.props.token && !this.gotAlbumInfo) {
        this.renderAlbumData();
        this.render() }
    }

  
  renderAlbumData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
    console.log('token: ' + this.props.token)
    get('https://api.spotify.com/v1/albums/' + this.props.match.params.albumid, {}, function(albumData) {

        console.log('album data in get: ' + albumData)
        obj.setState({
            albumInfo: albumData
        })
    }, null, artistHeader);
    this.gotAlbumInfo = true;
}

    
render() {
    let image, name, artist = '';
    let tracks = [];
    if (this.state.albumInfo) {
        image = <Image centered size="medium" rounded src={this.state.albumInfo.images[0].url}/>
        name = this.state.albumInfo.name;
        artist = this.state.albumInfo.artists[0].name;
        for(let i  = 0; i < this.state.albumInfo.tracks.items.length; i++) {
            tracks.push(this.state.albumInfo.tracks.items[i]);
        }
    }

    return(
        <div>
            <NavBar/>
    <Container>
        <Container className="center-text" id="album-image">
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
        <Segment.Group>
           {tracks.map( track => {
               return(
               <Segment>
                   <a href={"/song/" + track.id}>{track.name}</a>
               </Segment>)
           })}
        </Segment.Group>
    </Container></div>)
}
}

export default Album;