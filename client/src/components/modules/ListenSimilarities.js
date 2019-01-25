import React, { Component } from 'react';
import _ from 'lodash'
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Header, Message, Button } from 'semantic-ui-react';
import { post, get } from "./api"
import { loadavg } from 'os';

class ListenSimilarites extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');
        //props: viewerInfo, cardUserInfo
        this.state = {
            artistsInCommon: [],
            songsInCommon : []
        }

    }
    componentDidMount() {
        this.loadMatches();
    }

    loadMatches() {
        const obj = this;
        var header = [['Authorization', 'Bearer ' + this.props.viewerInfo.access_token]];

        const intersect_songs = _.intersection(this.props.viewerInfo.recently_played_tracks, this.props.cardUserInfo.recently_played_tracks);
        const intersect_artists = _.intersection(this.props.viewerInfo.recently_played_artists, this.props.cardUserInfo.recently_played_artists);

        const artists = intersect_artists.map(artistId => {
            get('https://api.spotify.com/v1/artists/' + artistId, {}, function(artistData) {
                return artistData;
            }, null, header);
        })

        const songs = intersect_songs.map(songId => {
            get('https://api.spotify.com/v1/tracks/' + songId, {}, function(songData) {
                return songData;
            }, null, header);
        })
        this.setState({
            artistsInCommon: artists,
            songsInCommon: songs
        })
        console.log(this.state.artistsInCommon)
        console.log(this.state.songsInCommon)
    }

    loadArtists() {
        if (this.state.artistsInCommon.length > 0) {
            return this.state.artistsInCommon.map( artist => {
                return(
                    <Header>
                        {artist.name}
                    </Header>
                ) 
            })
        }
        else {
            return(
                <Header>
                    No artist in common :(
                </Header>
            )
        }

    }

    loadSongs() {
        if (this.state.songsInCommon.length > 0) {
            return this.state.songsInCommon.map( song => {
                return(
                    <Header>
                        {song.name}
                    </Header>
                ) 
            })
        }
        else {
            return(
                <Header>
                    No songs in common :(
                </Header>
            )
        }

    }

    render() {
        return(
            <div>
                <Header> Artists in Common : {this.loadArtists}</Header>
                <Header> Songs in Common: {this.loadSongs}</Header>
            </div>
        )
    }
}
export default ListenSimilarites;