import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Loader, Header, Grid, Segment, Image, Container } from 'semantic-ui-react';
import default_profile from "../../public/assets/default_profile.png";
import NavBar from "../modules/NavBar";
import SuggestionForm from '../modules/SuggestionForm';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            userInfo: null,
            isRedirecting: false
        };
        this.gotProfileInfo = false;

    }

    componentDidMount() {
        if (this.props.match.params.user !== "me") {
            this.getProfile(this.props.match.params.user); }
    }

    componentDidUpdate() {
        if (!this.gotProfileInfo) {
            if (this.props.match.params.user !== "me") {
                this.getProfile(this.props.match.params.user); }

            else if (!this.state.isRedirecting && this.props.viewerInfo.access_token !== null) {
            this.props.history.push('/u/profile/' + this.props.viewerInfo._id)
            this.state.isRedirecting = true;
        }
    }
    }

    getProfile(id) {

        fetch('/api/user?_id=' + id).then(res => res.json())
        .then((profile) => {
            this.setState({
                userInfo: profile,
                isRedirecting: false
            })
            this.gotProfileInfo = true;
        })
    }

    loadSuggestionBox() {
        if(this.gotProfileInfo) {
            return (<SuggestionForm userId={this.props.viewerInfo._id} receiverId={this.state.userInfo._id}/>);
        }
        else {
            <Loader active inline />
        }
    }

    loadFavArtists() {
        if(this.gotProfileInfo) {
            return(
                this.state.userInfo.top_artists.map( track => {
                return(
                <Segment key={track.id}>
                    <a href={"/artist/" + track.id}>{track.name}</a>
                </Segment>);
            })
            );
        }
        else {
            <Segment>
                <Loader/>
            </Segment>
        }
    }

    loadFavSongs() {
        if(this.gotProfileInfo) {
            return(
                this.state.userInfo.top_songs.map( song => {
                return(
                <Segment key={song.id}>
                    <a href={"/song/" + song.id}>{song.name}</a>
                </Segment>);
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
        let image, description = '';
        let spotify_follower = 0;
        if (this.gotProfileInfo) {
            image = (this.state.userInfo.image !== '' ? this.state.userInfo.image : default_profile)
            description = this.state.userInfo.descrip;

            spotify_follower = this.state.userInfo.spotify_followers;

            
            //<Segment raised> My fav song rn: {fav_song_rn.name}</Segment>
        }
        if (this.state.isRedirecting) {
            return (
                <Loader size='massive'></Loader>
            )
        }
        
        return (
            <div>
                <NavBar userInfo={this.props.viewerInfo}/>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Image circular size='small' src={image}/>
                            <Header as="h5">Spotify Followers: {spotify_follower}</Header>
                        </Grid.Column>
                        <Grid.Column>
                            {this.loadSuggestionBox()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid columns={3}>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h2">
                                Description: {description}
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment.Group>
                                {this.loadFavSongs()}
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment.Group>
                                {this.loadFavArtists()}
                            </Segment.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        ) 
    }
    
}
export default Profile;