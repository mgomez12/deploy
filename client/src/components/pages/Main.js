import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";
import NavBar from "../modules/NavBar"
import SuggestionBox from "../modules/SuggestionBox"
import { Loader, Container, Grid} from "semantic-ui-react";

class Main extends Component {
	constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.props.userInfo !== null && !this.props.userInfo.name) {
            console.log('main redirected');
            this.props.history.push("/login");
        }
    }

    render() {
        if (this.props.userInfo.access_token == null) {
            return <Loader size='massive'/>
        }
        console.log(this.props.userInfo.name)
        return(<div>
            <NavBar history={this.props.history} userInfo={this.props.userInfo}/>
            <Container style={{padding: '5em'}}>
                <Grid columns='2' stackable style={{height:'80vh'}}>
                    <Grid.Column>
                        <SuggestionBox userInfo={this.props.userInfo}/>
                    </Grid.Column>
                </Grid>
            </Container>
            
        </div>)

    }
}

export default withRouter(Main);
