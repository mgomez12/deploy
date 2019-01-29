import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Item, Segment, Header, Image, Container, Card } from 'semantic-ui-react';
import {get, get2} from "../modules/api";
import Coverflow from 'react-coverflow';

class Artist extends Component {
    constructor(props) {
        super(props);

        // will have to change server directory at some time
        
        this.state = {
            artistInfo: null,
            artistid: null,
            artisttoptracks: null,
            artistalbums: null,
            relatedartists: null,
            artistsingles: null
        };
        this.gotArtistInfo = false;

    }
    componentDidMount() {
        if (this.props.token && !this.gotArtistInfo) {
            this.renderArtistData();}
        if(this.state.artistInfo!=null) {
            if (this.props.match.params.artistid!=this.state.artistInfo.id) {
                this.renderArtistData();
            }
        }
        console.log("hello")
        console.log(this.state.artistInfo)
    }
    componentDidUpdate() {
        if (this.props.token && !this.gotArtistInfo) {
        this.renderArtistData();}
        if(this.state.artistInfo!=null) {
            if (this.props.match.params.artistid!=this.state.artistInfo.id) {
                this.renderArtistData();
            }
        }
    }

  
    renderArtistData() {
        const obj = this;
        var artistHeader = [['Authorization', 'Bearer ' + this.props.token]];
        get2('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid, null, artistHeader)
        .then(artistData => {
            obj.setState({
                artistInfo: artistData
            })
        } )
        .then(() => {
            return get2('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/top-tracks", {country:"US"}, artistHeader);
        })
        .then( artistData => {
            obj.setState({
                artisttoptracks: artistData
            })
        })
        .then(()=> {
            return get2('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/albums", {country:"US", include_groups:"album"}, artistHeader);
        })
        .then( artistData => {
            obj.setState({
                artistalbums: artistData
            })
        })
        .then(()=> {
            return get2('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/albums", {country:"US", include_groups:"single"}, artistHeader);
            })
        .then( artistData => {
            obj.setState({
                artistsingles: artistData
            })
        })
        .then(()=> {
            return get2('https://api.spotify.com/v1/artists/' + this.props.match.params.artistid + "/related-artists", null, artistHeader);
        })
        .then( artistData => {
            obj.setState({
                relatedartists: artistData
            })
            this.gotArtistInfo=true
            this.render();
        })
    }

    loadRelatedArtistsImagesList() {
        if (this.state.artistInfo && this.state.relatedartists) {
            return(
                this.state.relatedartists.artists.map( artist => {
                return(
                    <a href={"/artist/" + artist.id}><img src={artist.images[0].url} alt={artist.name} style={{ display: 'block', width: '100%' }}/></a>
                );
                })
            );
        }
        else {
            <Segment>
                <Loader/>
            </Segment>
        }
    }

    loadRelatedArtistsImagesList() {
        if (this.state.artistInfo && this.state.relatedartists) {
            return(
                this.state.relatedartists.artists.map( artist => {
                return(
                    <a href={"/artist/" + artist.id}><img src={artist.images[0].url} alt={artist.name} style={{ display: 'block', width: '100%' }}/></a>
                );
                })
            );
        }
        else {
            <Segment>
                <Loader/>
            </Segment>
        }
    }

    loadFavAlbumsCards() {
        if(this.state.artistInfo && this.state.relatedartists) {
            return(
                this.state.artistalbums.items.map( album => {
                return(
                    <Card> <a href={"/album/" + album.id}><Image src={String(album.images[0].url)}/></a><Card.Content>
                <Card.Header>{album.name}</Card.Header></Card.Content></Card>);
            })
            );
        }
        else {
            <Segment>
                <Loader active size='tiny'>Loading<Image size='tiny' centered src={confused_llama}/></Loader>
            </Segment>
        }
    }

    loadFavSinglesCards() {
        if(this.state.artistInfo && this.state.relatedartists) {
            return(
                this.state.artistsingles.items.map( song => {
                return(
                    <Card> <a href={"/album/" + song.id}><Image src={String(song.images[0].url)}/></a><Card.Content>
                <Card.Header>{song.name}</Card.Header></Card.Content></Card>);
            })
            );
        }
        else {
            <Segment>
                <Loader active size='tiny'>Loading<Image size='tiny' centered src={confused_llama}/></Loader>
            </Segment>
        }
    }
    
render() {
    let image, artist = '';
    let toptracks=[];
    let albums=[];
    let related=[];
    let singles=[];
    let artistimage_list=[];
    let albumimage_list=[];
    let singleimage_list=[];
    let timeString= '0:00';
    if (this.state.artistInfo && this.state.artisttoptracks && this.state.artistalbums && this.state.relatedartists) {
        image = <Image size="medium" centered rounded src={this.state.artistInfo.images[0].url}/>
        artist = this.state.artistInfo.name;
        for(let i  = 0; i < this.state.artisttoptracks.tracks.length; i++) {
           toptracks.push(this.state.artisttoptracks.tracks[i]);
        }
        for(let i  = 0; i < this.state.artistalbums.items.length; i++) {
           albums.push(this.state.artistalbums.items[i]);
        }
        for(let i  = 0; i < this.state.artistsingles.items.length; i++) {
            singles.push(this.state.artistsingles.items[i]);
         }

        for(let i  = 0; i < this.state.relatedartists.artists.length; i++) {
           related.push(this.state.relatedartists.artists[i]);
        }
        artistimage_list=this.loadRelatedArtistsImagesList()
        albumimage_list=this.loadFavAlbumsCards()
        singleimage_list=this.loadFavSinglesCards()
    }

    return(
        <div className='page'>
        <Container>
        <section>
        <div>
        <section>
        <Container>
            {image}    
        </Container>
        </section>
        </div>
        <div>
        <Header size= "huge">
            {artist}
        </Header>
        </div>
        <div>
        <section>
        <Header as="h2">
            {"Top Songs"}
        </Header>
        </section>
        <Item.Group>
            <Segment.Group>
        {toptracks.map( track => {
            const minutes = Math.floor(track.duration_ms / 60000);
            let seconds = Math.floor(track.duration_ms % 60);
            if (seconds < 10) {seconds = '0' + seconds}
            timeString = minutes + ':' + seconds;
            return(
                <Item href={"/song/" + track.id}>
                <Segment color="gray">
                <Item.Content>
                    <a href={"/song/" + track.id} id="songdisplay2">{track.name}</a>
                    <p className="rightaligntext" id="songdisplay2">{timeString}</p>
                </Item.Content>
                </Segment>
                </Item>)
        })}
           </Segment.Group>
           </Item.Group>
        </div>
        <section>
        <Header as="h2">
                        Full-Length Albums: 
        </Header>
        </section>
        <Card.Group itemsPerRow={5}>
            {albumimage_list}
        </Card.Group>
        <section>
        <Header as="h2">
                        Singles and EPs: 
        </Header>
        </section>
        <Card.Group itemsPerRow={5}>
            {singleimage_list}
        </Card.Group>
        <section>
        <Header as="h2">
                    Related Artists: 
        </Header>
        </section>
        <Coverflow
            width={960}
            height={480}
            displayQuantityOfSide={2}
            navigation={false}
            enableHeading={false}
        >
        <div
        onClick={() => fn()}
        onKeyDown={() => fn()}
        role="menuitem"
        tabIndex="0"
        >
        </div>
        {artistimage_list}
        </Coverflow>
        </section>
        </Container>
        </div>)
    }
    }

export default Artist;
