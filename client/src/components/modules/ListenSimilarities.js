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
        this.loadArtists = this.loadArtists.bind(this)
        this.loadSongs = this.loadSongs.bind(this)

    }
    componentDidMount() {
        this.loadMatches();
    }

    loadMatches() {
        const obj = this;
        var header = {
            Authorization: 'Bearer ' + this.props.viewerInfo.access_token
        }
        const intersect_songs = _.intersection(this.props.viewerInfo.recently_played_tracks, this.props.cardUserInfo.recently_played_tracks);
        const intersect_artists = _.intersection(this.props.viewerInfo.recently_played_artists, this.props.cardUserInfo.recently_played_artists);
        const intersect_genres = _.intersection(this.props.viewerInfo.recent_genres, this.props.cardUserInfo.recent_genres);
        var intersect_related_artists = _.intersection(this.props.viewerInfo.related_artists, this.props.cardUserInfo.related_artists);
        intersect_related_artists = _.difference(intersect_related_artists,this.props.viewerInfo.recently_played_artists);
        intersect_related_artists = _.difference(intersect_related_artists,this.props.cardUserInfo.recently_played_artists);

        Promise.all(intersect_artists.map(artistId => {
            return get2('https://api.spotify.com/v1/artists/' + artistId, null, header);
        })).then( artists => {
            console.log(artists)
            this.setState({
                genresInCommon: intersect_genres,
                artistsInCommon: artists,
                relatedArtistsInCommon: intersect_related_artists

        })})

        Promise.all(intersect_songs.map(songId => {
            return get2('https://api.spotify.com/v1/tracks/' + songId, null, header);
        })).then( songs => {
            console.log(songs)
            this.setState({
            songsInCommon: songs
        })})
        

        this.setState({
            loaded: true
        })

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
            return this.state.genreInCommon.map( genre => {
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
        if (this.state.genresInCommon.length > 0) {
            return this.state.relatedArtistsInCommon.map( artist => {
                return(
                    <div>
                        {artist}
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

    render() {
        if(!this.state.loaded) {
            return(
                <Loader/>
            )
        }
        return(
            <div>
                <div>
                    You and {this.props.cardUserInfo.name} both listened to: {this.loadArtists()}
                </div>
                <div>
                    You and {this.props.cardUserInfo.name} both listened to: {this.loadSongs()}
                </div>
                <div>
                    You and {this.props.cardUserInfo.name} both listened to: {this.loadArtists()}
                </div>
                <div>
                    You and {this.props.cardUserInfo.name} may both like: {this.loadSongs()}
                </div>
            </div>
        )
    }
}
export default ListenSimilarites;