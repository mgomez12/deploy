import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Loader, Header, Grid, Segment, Image, Container } from 'semantic-ui-react';
import default_profile from "../../public/assets/default_profile.png";
import SuggestionForm from '../modules/SuggestionForm';
import FriendForm from '../modules/FriendForm';

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
            return (<SuggestionForm userId={this.props.viewerInfo._id} receiverId={this.state.userInfo._id} isTrack={true}/>);
        }
        else {
            <Loader active inline />
        }
    }

    loadFriendBox() {
        if(this.gotProfileInfo) {
            return (<FriendForm userId={this.props.viewerInfo._id} receiverId={this.state.userInfo._id} />);
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
                <Segment className='center-parent' key={track.id}>
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
                <Segment className='center-parent' key={song.id}>
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
        let image, description, name= '';
        let spotify_follower = 0;
        if (this.gotProfileInfo) {
            name = (this.state.userInfo.name)
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
                <Grid style={{padding:"10px"}}>
                    <Grid.Row columns={2} verticalAlign='middle'>  
                        <Grid.Column width='5' className='center-parent'>
                            <Image circular className= 'center-parent' size='small' src={image}/>
                            <Header as='h2'>{name}</Header>
                            <Header as="h5">Spotify Followers: {spotify_follower}</Header>
                        </Grid.Column >
                        <Grid.Column width='10'>
                            <div className='center-parent'>
                            <Header as='h4'>Suggest a song!</Header>
                            {this.loadSuggestionBox()}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        <Grid.Column>
                            <div className='center-parent'>
                                <Header as='h4'>Follow user!</Header>
                                {this.loadFriendBox()}
                            </div>
                            <Header as="h2">
                                Description: {description}
                            </Header>
                        </Grid.Column>
                        <Grid.Column style={{'textAlign':'center'}}>
                            <Header as="h3">
                            Top Songs: 
                            </Header>
                            <Segment.Group raised>
                                {this.loadFavSongs()}
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column style={{'textAlign':'center'}}>
                            <Header as="h3">
                            Top Artists:
                            </Header>
                            <Segment.Group raised>
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
