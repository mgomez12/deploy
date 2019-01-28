import React, { Component } from 'react';
import _ from 'lodash'
import "../../public/css/styles.css"
import { Loader, Header, Message, Button } from 'semantic-ui-react';
import { post, get, get2 } from "./api"
import { loadavg } from 'os';

class ListenSimilarites extends Component {
    constructor(props) {
        super(props);

        //props: viewerInfo, cardUserInfo
        this.state = {
            artistsInCommon: [],
            songsInCommon : [],
            genresInCommon: [],
            relatedArtistsInCommon: [],
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
        })})

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
                        {artist.name}
                    </div>
                ) 
            })
        }
        else {
            return(
                <div>
                    No artist in common :(
                </div>
            )
        }

    }

    loadSongs() {
        if (this.state.songsInCommon.length > 0) {
            return this.state.songsInCommon.map( song => {
                return(
                    <div>
                        {song.name}
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
                        {artist.name}
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

    render() {
        if(!this.state.loaded) {
            return(
                <Loader/>
            )
        }
        return(
            <div>
                <div>
                    You and {this.props.cardUserInfo.name} both recently listened to: {this.loadArtists()} 
                </div>
                <div>
                    and... {this.loadSongs()}
                </div>
                <div>
                    and share tastes in... {this.loadGenres()}
                </div>
                <div>
                    You may both like: {this.loadRelatedArtists()}
                </div>
            </div>
        )
    }
}
export default ListenSimilarites;