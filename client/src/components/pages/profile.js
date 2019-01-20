import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Image, Container } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import NavBar from "../modules/navbar";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            userInfo: null
        };

    }

    componentDidMount() {
        this.getProfile(this.props.match.params.user);
    }

    getProfile(id) {
        fetch('/api/user?_id=' + id).then(res => res.json())
            .then((profile) => {
                this.setState({
                    userInfo: profile
                })

            })
    }

    render() {
        let songs = '';
        if (this.state.userInfo === null) {
            songs = ' user info not loaded'
        }
        else {

            console.log("top songs" + this.state.userInfo);
            songs = 'Top songs: ';
      this.state.userInfo.top_songs.map((song) => {
          songs += song.name + ", "
        }
        ); }

        return (
            <div>
                <NavBar/>
            {songs}
            <Container>
                <Image centered circular size='medium' src={nick_pic}/>
            </Container>
            </ div>
        ) 
    }
    
}
        export default Profile;