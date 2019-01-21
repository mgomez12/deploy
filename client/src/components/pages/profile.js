import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import NavBar from "../modules/NavBar";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            userInfo: null
        };
        this.gotProfileInfo = false;

    }

    componentDidMount() {
        this.getProfile(this.props.match.params.user);
    }

    componentDidUpdate() {
        if (!this.gotProfileInfo) {
        this.getProfile(this.props.match.params.user);
        this.render() }
    }

    getProfile(id) {
        fetch('/api/user?_id=' + id).then(res => res.json())
        .then((profile) => {
            this.setState({
                userInfo: profile
            })
            this.gotProfileInfo = true;
        })
    }

    render() {
        let image, description = '';
        let spotify_follower = 0;
        let fav_song_rn, top_songs, top_artists = {};
        if (!this.gotProfileInfo) {
            songs = ' user info not loaded'
        }
        else {
            console.log("top songs" + this.state.userInfo.images);
            image = this.state.userInfo.images;
            description = this.state.userInfo.descrip;

            spotify_follower = this.state.userInfo.spotify_followers;

            fav_song_rn = this.state.userInfo.fav_song_rn;
            top_songs = this.state.userInfo.top_songs;
            top_artists = this.state.userInfo.top_artists;
            

        }

        return (
            <Container>
                <div>
                <NavBar/>
                <Container>
                    <Image centered circular size='medium' src={image}/>
                </Container>
                <p>Spotify Followers: {spotify_follower}</p>
                <Segment raised> My fav song rn: {fav_song_rn.name}</Segment>
                </ div>
                <Container>
                    <Segment.Group>
                        {top_songs.map( track => {
                            return(
                            <Segment>
                                <a href={"/song/" + track.id}>{track.name}</a>
                            </Segment>)
                        })}
                    </Segment.Group>
                </Container>
                <Container>
                    <Segment.Group>
                        {top_artists.map( artist => {
                            return(
                            <Segment>
                                <a href={"/artist/" + artist.id}>{artist.name}</a>
                            </Segment>)
                        })}
                    </Segment.Group>
                </Container>
            </Container>
        ) 
    }
    
}
        export default Profile;