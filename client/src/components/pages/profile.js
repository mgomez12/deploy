import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Loader, Header, Grid, Segment, Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import NavBar from "../modules/NavBar";
import SuggestionForm from '../modules/SuggestionForm';

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
        console.log("didMount")
        this.getProfile(this.props.match.params.user);
    }

    componentDidUpdate() {
        console.log("didUpdate")
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

    loadSuggestionBox() {
        if(this.gotProfileInfo) {
            return (<SuggestionForm userId={this.props.viewerInfo._id} recieverId={this.state.userInfo._id}/>);
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
                <Segment>
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
                <Segment>
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
            console.log("top songs" + this.state.userInfo.top_songs[0].name);
            image = this.state.userInfo.image;
            console.log("image: " + image)
            description = this.state.userInfo.descrip;

            spotify_follower = this.state.userInfo.spotify_followers;

            console.log(this.state.userInfo.fav_song_rn);
            
            //<Segment raised> My fav song rn: {fav_song_rn.name}</Segment>
        }
        
        return (
            <Container>
                <div>
                    <NavBar/>
                </div>
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
            </Container>
        ) 
    }
    
}
        export default Profile;