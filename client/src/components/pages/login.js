import React, { Component } from "react";
import "../../public/css/styles.css";
import { Button, Header } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import introVid from '../../public/assets/goodguy.mp4';

class Login extends Component {
	constructor(props) {
        super(props);

        this.state = {
        };
    }


    render() {
        return (
            <div>
        <video autoPlay muted loop id="background-video">
                <source src={introVid} type="video/mp4"/>
        </video>
        <div className="center-screen" id="center-text">
            <Header size="huge" id="color-white">
                <i>groove</i>
            </Header>
            <Link to={"/api/auth/spotify"}>
            <Button size='mini'>Login with Spotify</Button>
            </Link>
        </div>
        </div>
        )
    }

    login() {
        this.context.router.push('/api/auth');
    }
}
export default Login;