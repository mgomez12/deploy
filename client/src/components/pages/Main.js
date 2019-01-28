import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";
import NavBar from "../modules/NavBar"
import SuggestionBox from "../modules/SuggestionBox"
import Dash from "../modules/Dash"
import { Sticky, Visibility, Loader, Container, Grid} from "semantic-ui-react";
import SearchBarUser from '../modules/SearchBarUser';
import WeeklyPlaylist from '../modules/WeeklyPlaylist';

class Main extends Component {
	constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate() {
        if (this.props.userInfo !== null && !this.props.userInfo.name) {
            console.log('main redirected');
            this.props.history.push("/login");
        }
    }

    handleContextRef = contextRef => this.setState({ contextRef })

    render() {
        const { contextRef } = this.state
        if (this.props.userInfo.access_token == null) {
            return <Loader size='massive'/>
        }
        return(<div className='page' >
            <Container>
                <NavBar history={this.props.history} userInfo={this.props.userInfo}/>
            </Container>
                <Container style={{padding: '5em'}}>
                    <Grid columns='2' stackable style={{height:'80vh'}}>
                        <Grid.Column>
                                <SuggestionBox userInfo={this.props.userInfo}/>
                        </Grid.Column>
                        <Grid.Column>
                                {console.log(contextRef)}
                                <WeeklyPlaylist userInfo={this.props.userInfo} history={this.props.history}/>
                                <SearchBarUser history={this.props.history}/>
                                <Dash userInfo={this.props.userInfo} friendCount ={this.props.userInfo.friends}/>
                        </Grid.Column>
                    </Grid>
                </Container>            
        </div>)

    }
}

export default withRouter(Main);
