import React, { Component } from 'react';
//import { Link } from 'react-router';
import "../../public/css/styles.css"
import { Item, Segment, Header, Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import {get} from "../modules/api";

class Album extends Component {
    constructor(props) {
        super(props);

        // will have to change server directory at some time
        this.state = {
            albumInfo: null,
            albumid: null
        };
        this.gotAlbumInfo = false;

    }
    componentDidMount() {
        const album = this.props.match.params.albumid
        this.setState({
            albumid: album
        })
    }
    componentDidUpdate() {
        if (this.props.token && !this.gotAlbumInfo) {
        this.renderAlbumData();}
        if(this.state.albumInfo!=null) {
            if (this.props.match.params.albumid!=this.state.albumInfo.id) {
                this.renderAlbumData();
            }
        }

    }

  
  renderAlbumData() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
    get('https://api.spotify.com/v1/albums/' + this.props.match.params.albumid, {}, function(albumData) {

        obj.setState({
            albumInfo: albumData
        })
    }, null, artistHeader);
    this.gotAlbumInfo = true;
}

convertminutes(){

}


    
render() {
    let image, name, artist, artistid = '';
    let tracks = [];
    let timeString='0:00';
    if (this.state.albumInfo) {
        image = <Image centered size="medium" rounded src={this.state.albumInfo.images[0].url}/>
        name = this.state.albumInfo.name;
        artist = this.state.albumInfo.artists[0].name;
        artistid=this.state.albumInfo.artists[0].id
        for(let i  = 0; i < this.state.albumInfo.tracks.items.length; i++) {
            tracks.push(this.state.albumInfo.tracks.items[i]);
        }
    }

    return(
        <div className='page'>
    <Container>
        <Container className="center-text" id="album-image" padding="100px">
            {image}    
        </Container>
        <div>
            <Header size='large' id="songdisplay">
                {name}
            </Header>
            <Header size='medium'>
            <a href={"/artist/" + artistid} id="songdisplay2">{artist}</a>
            </Header>
        </div>
            <Item.Group>
            <Segment.Group>
           {tracks.map( track => {
                const minutes = Math.floor(track.duration_ms / 60000);
                let seconds = Math.floor(track.duration_ms % 60);
                if (seconds < 10) {seconds = '0' + seconds}
                timeString = minutes + ':' + seconds;
               return(
                    <Item href={"/song/" + track.id}>
                    <Segment color="gray">
                    <Item.Content>
                        <a href={"/song/" + track.id} id="songdisplay2">{track.name}</a>
                        <p className="rightaligntext" id="songdisplay2">{timeString}.</p>
                    </Item.Content>
                    </Segment>
                    </Item>)
           })}
           </Segment.Group>
           </Item.Group>
    </Container></div>)
}
}

export default Album;