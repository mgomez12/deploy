import React, { Component } from "react";
import "../../public/css/styles.css";
import { Image, Button, Header } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import introVid from '../../public/assets/goodguy.mp4';
import basic_llama from "../../public/assets/basic_llama.png";



class Login extends Component {
	constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
        <video autoPlay muted loop id="background-video">
                <source src={introVid} type="video/mp4"/>
        </video>
        <div className="center-screen" id="center-text">
            <Header size="huge" id="color-white">
                <i>groove </i>
                <Image size='mini' src={basic_llama}/>
            </Header>
            <Button size='mini' href='/auth/spotify'>Login with Spotify</Button>
        </div>
        </div>
        )
    }
}
export default Login;