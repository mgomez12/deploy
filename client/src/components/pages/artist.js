import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Segment, Header, Image, Container } from 'semantic-ui-react';
import {get} from "../modules/api";
import NavBar from "../modules/NavBar"

class Artist extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');
        // will have to change server directory at some time
        
        this.state = {
            artistInfo: null,
            artistid: null,
            artisttoptracks: null,
            artistalbums: null
        };
        this.gotArtistInfo = false;

    }
    componentDidUpdate() {
        if (this.props.token && !this.gotArtistInfo) {
        this.renderArtistData();
        this.render() }
    }

  
  renderArtistData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
    console.log('token: ' + this.props.token)
    get('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid, {}, function(artistData) {

        console.log('artist data in get: ' + artistData)
        obj.setState({
            artistInfo: artistData
        })
    }, null, artistHeader);

    get('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/top-tracks", {country:"US"}, function(artistData) {

        console.log('artist track data in get: ' + artistData)
        obj.setState({
            artisttoptracks: artistData
        })
    }, null, artistHeader);

    get('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/albums", {country:"US", include_groups:"album"}, function(artistData) {

        console.log('artist track data in get: ' + artistData)
        obj.setState({
            artistalbums: artistData
        })
    }, null, artistHeader);
    this.gotArtistInfo=true
}


    
render() {
    let image, artist = '';
    let toptracks=[]
    let albums=[]
    if (this.state.artistInfo && this.state.artisttoptracks && this.state.artistalbums) {
        image = <Image centered size="medium" rounded src={this.state.artistInfo.images[0].url}/>
        artist = this.state.artistInfo.name;
        for(let i  = 0; i < this.state.artisttoptracks.tracks.length; i++) {
            console.log(this.state.artisttoptracks.tracks[i]);
           toptracks.push(this.state.artisttoptracks.tracks[i]);
        }
        for(let i  = 0; i < this.state.artistalbums.items.length; i++) {
            console.log(this.state.artistalbums.items[i]);
           albums.push(this.state.artistalbums.items[i]);
        }
    console.log(albums)
    }

    return(
        <div>
            <NavBar/>
    <Container>
        <section>
        <Container className="center-text" id="artist-image">
            {image}    
        </Container>
        </section>
        <section class="headtitle">
            <Header size='large'>
                {artist}
            </Header>
        </section>
        <section class="mediumtitle">
            <Header size='medium'>
                {"Top Songs"}
            </Header>
        </section>
        <section class="artistlist">
        <div>
           {toptracks.map( track => {
               {console.log(track.name)}
               return(
               <Segment compact>
                    <a href={"/song/" + track.id}>{track.name}</a>
               </Segment>)
            })}
        </div>
        </section>
    <section class="mediumtitle">
    <div>
        <Container>
            <Header size='medium'>
                {"Albums"}
            </Header>
        </Container>
    </div>
    </section>
    <section class="artistlist">
    <div>
        {albums.map( album => {
            {console.log(album.name)}
            return(
            <Segment compact>
                <a href={"/album/" + album.id}>{album.name}</a>
            </Segment>)
        })}
    </div>
    </section>
    </Container>
    </div>)
}
}

export default Artist;