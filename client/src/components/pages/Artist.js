import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Segment, Header, Image, Container } from 'semantic-ui-react';
import {get, get2} from "../modules/api";

class Artist extends Component {
    constructor(props) {
        super(props);

        // will have to change server directory at some time
        
        this.state = {
            artistInfo: null,
            artistid: null,
            artisttoptracks: null,
            artistalbums: null,
            relatedartists: null
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


    
render() {
    let image, artist = '';
    let toptracks=[]
    let albums=[]
    let related=[]
    if (this.state.artistInfo && this.state.artisttoptracks && this.state.artistalbums && this.state.relatedartists) {
        image = <Image size="medium" centered rounded src={this.state.artistInfo.images[0].url}/>
        artist = this.state.artistInfo.name;
        for(let i  = 0; i < this.state.artisttoptracks.tracks.length; i++) {
           toptracks.push(this.state.artisttoptracks.tracks[i]);
        }
        for(let i  = 0; i < this.state.artistalbums.items.length; i++) {
           albums.push(this.state.artistalbums.items[i]);
        }
        for(let i  = 0; i < this.state.relatedartists.artists.length; i++) {
           related.push(this.state.relatedartists.artists[i]);
        }
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
               <Segment floated="left">
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
            {albums.map( album => {
                return(
                <Segment floated="left">
                    <a href={"/album/" + album.id}>{album.name}</a>
                </Segment>)
         })}
        </div>
        </section>
        <section className="mediumtitle">
                <Header size='large'>
                    {"Related Artists"}
                </Header>
            </section>
            <section className="artistlist">
            <div>
            {related.map( person => {
                   return(
                <Segment floated="left">
                        <a href={"/artist/" + person.id}>{person.name}</a>
                </Segment>)
                })}
            </div>
            </section>
            </Container>
        </div>)
    }
    }

export default Artist;
