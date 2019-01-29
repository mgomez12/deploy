import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Segment, Header, Image, Container } from 'semantic-ui-react';
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


    
render() {
    let image, artist = '';
    let toptracks=[]
    let albums=[]
    let related=[]
    let singles=[]
    let artistimage_list=[]
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
    }

    return(
        <div className='page'>
        <Container>

        <section>
        <Container>
            {image}    
        </Container>
        </section>
        <section>
        <Container>
        <Header size= "large">
                {artist}
        </Header>
        </Container>
        </section>
        <div>
        <section className="mediumtitle">
            <Header size='large'>
                {"Top Songs"}
            </Header>
        </section>
        <section className="artistlist">
           {toptracks.map( track => {
               return(
               <Segment>
                    <a href={"/song/" + track.id}>{track.name}</a>
               </Segment>)
            })}
        </section>
        </div>


        <section className="mediumtitle">
        <div>
            <Container>
                <Header size='large'>
                    {"Albums"}
                </Header>
            </Container>
        </div>
        </section>
        <section className="artistlist">
        <div>
            <Header size="medium">
                {"Full-Length Albums"}
            </Header>
            {albums.map( album => {
                return(
                <Segment floated="left">
                    <a href={"/album/" + album.id}>{album.name}</a>
                </Segment>)
         })}
        </div>
        <section>
        <div>
            <Header size="medium">
                {"Singles"}
            </Header>
            {singles.map( single => {
                return(
                <Segment floated="left">
                    <a href={"/album/" + single.id}>{single.name}</a>
                </Segment>)
         })}
        </div> 
        </section>
        </section>
        <section className="mediumtitle">
                <Header size='large'>
                    {"Related Artists"}
                </Header>
        </section>
            {/* <section className="artistlist">
            <div>
            {related.map( person => {
                   return(
                <Segment floated="left">
                        <a href={"/artist/" + person.id}>{person.name}</a>
                </Segment>)
                })}
            </div>
            </section> */}
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
            </Container>
        </div>)
    }
    }

export default Artist;
