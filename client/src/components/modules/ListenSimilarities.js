import React, { Component } from 'react';
import _ from 'lodash'
import "../../public/css/styles.css"
import { Icon, Accordion, Loader, Header, Message, Button } from 'semantic-ui-react';
import {Link } from "react-router-dom";
import { post, get, get2 } from "./api"
import { loadavg } from 'os';

class ListenSimilarites extends Component {
    constructor(props) {
        super(props);

        //props: viewerInfo, cardUserInfo
        this.state = {
            activeIndex: 5,
            artistsInCommon: [],
            songsInCommon : [],
            genresInCommon: [],
            relatedArtistsInCommon: [],
            recommendations: [],
            loaded: false
        }

    }
    componentDidMount() {
        this.loadMatches();
    }

    loadMatches() {
        const obj = this;
        var header = {
            Authorization: 'Bearer ' + this.props.viewerInfo.access_token
        }
        var intersect_songs = _.intersection(this.props.viewerInfo.recently_played_tracks, this.props.cardUserInfo.recently_played_tracks);
        var intersect_artists = _.intersection(this.props.viewerInfo.recently_played_artists, this.props.cardUserInfo.recently_played_artists);
        var intersect_genres = _.intersection(this.props.viewerInfo.recent_genres, this.props.cardUserInfo.recent_genres);
        
        intersect_songs = this.shuffle(intersect_songs);
        intersect_artists = this.shuffle(intersect_artists);
        intersect_genres = this.shuffle(intersect_genres);

        var intersect_related_artists = _.intersection(this.props.viewerInfo.related_artists, this.props.cardUserInfo.related_artists);
        intersect_related_artists = _.difference(intersect_related_artists,this.props.viewerInfo.recently_played_artists);
        intersect_related_artists = _.difference(intersect_related_artists,this.props.cardUserInfo.recently_played_artists);

        intersect_related_artists = this.shuffle(intersect_related_artists);
    
        if(intersect_songs.length>5) {
            intersect_songs=intersect_songs.splice(0,5)
        }
        if(intersect_artists.length>5) {
            intersect_artists=iintersect_artists.splice(0,5)
        }
        if(intersect_genres.length>5) {
            intersect_genres=intersect_genres.splice(0,5)
        }
        if(intersect_related_artists.length>5) {
            intersect_related_artists=intersect_related_artists.splice(0,5)
        }
        

        const artist_length = intersect_artists.length;
        var artist_string = "";
        if(artist_length>0) {
            var artist_string = "" + intersect_artists[0];
            for(var i = 1; i <artist_length; i++) {
                artist_string = artist_string + "," + intersect_artists[i];
            }
            artist_string = artist_string.replace(/:\s*/g,"%3A")
            artist_string = artist_string.replace(/,\s*/g,"%2C")
        }

        const song_length = intersect_songs.length;
        var song_string = "";
        if(song_length>0) {
            var song_string = "" + intersect_songs[0];
            for(var i = 1; i <song_length; i++) {
                song_string = song_string + "," + intersect_songs[i];
            }
            song_string = song_string.replace(/:\s*/g,"%3A")
            song_string = song_string.replace(/,\s*/g,"%2C")
        }


        Promise.all(intersect_artists.map(artistId => {
            return get2('https://api.spotify.com/v1/artists/' + artistId, null, header);
        })).then( artists => {
            this.setState({
                genresInCommon: intersect_genres,
                artistsInCommon: artists,
        })})

        Promise.all(intersect_songs.map(songId => {
            return get2('https://api.spotify.com/v1/tracks/' + songId, null, header);
        })).then( songs => {
            this.setState({
                songsInCommon: songs
        })})
        
        Promise.all(intersect_related_artists.map(artistId => {
            return get2('https://api.spotify.com/v1/artists/' + artistId, null, header);
        })).then( artists => {
            this.setState({
                relatedArtistsInCommon: artists
        })}).then( () => {
            if(artist_string=="" && song_string=="") {
                return []
            }
            else {
                return get2('https://api.spotify.com/v1/recommendations?seed_artists=' + artist_string + "&seed_tracks="+ song_string, null, header);
            }
        }).then( tracks => {
            console.log(tracks)
            this.setState({
                recommendations: tracks
            })
        })

        this.setState({
            loaded: true
        })
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

    loadArtists() {

        if (this.state.artistsInCommon.length > 0) {
            return this.state.artistsInCommon.map( artist => {
                return(
                    <div>
                        <Link to={"/artist/"+artist.id}>{artist.name}</Link>
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No artists in common :(
                </div>
            )
        }

    }

    loadSongs() {
        if (this.state.songsInCommon.length > 0) {
            return this.state.songsInCommon.map( song => {
                return(
                    <div>
                        <Link to={"/song/"+song.id}>{song.name}</Link>
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No songs in common :(
                </div>
            )
        }
    }

    loadGenres() {
        if (this.state.genresInCommon.length > 0) {
            return this.state.genresInCommon.map( genre => {
                return(
                    <div>
                        {genre}
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No genres in common :(
                </div>
            )
        }
    }

    loadRelatedArtists() {
        if (this.state.relatedArtistsInCommon.length > 0) {
            return this.state.relatedArtistsInCommon.map( artist => {
                return(
                    <div>
                        <Link to={"/artist/"+artist.id}>{artist.name}</Link>
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No related artists in common :(
                </div>
            )
        }
    }

    loadRecommendations() {
        console.log("break")
        console.log(this.state.recommendations)
        console.log("break")
        if (this.state.recommendations.length!={} && this.state.recommendations.length!=[]) {
            return this.state.recommendations.tracks.map( track => {
                return(
                    <div>
                        <Link to={"/song/"+track.id}>{track.name}</Link>
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No recommendations in common :(
                </div>
            )
        }
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }

    render() {
        const { activeIndex } = this.state
        if(!this.state.loaded) {
            return(
                <Loader/>
            )
        }
        return(
            <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name='dropdown' />
                You and {this.props.cardUserInfo.name} both recently listened to...
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {this.loadArtists()}
                </Accordion.Content>
        
                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                <Icon name='dropdown' />
                and...
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    {this.loadSongs()}
                </Accordion.Content>
        
                <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                <Icon name='dropdown' />
                You both listen to simlilar genres
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    {this.loadGenres()}
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                <Icon name='dropdown' />
                Related artists you both may like
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                    {this.loadRelatedArtists()}
                </Accordion.Content>

                <Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleClick}>
                <Icon name='dropdown' />
                Recommendations
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 4}>
                    {this.loadRecommendations()}
                </Accordion.Content>
            </Accordion>
        )
    }
}
export default ListenSimilarites;