import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Image, Container, Input } from 'semantic-ui-react';
import nick_pic from "../../public/assets/nick.jpg";
import NavBar from "./NavBar";
import { post } from "./api"

class SuggestionForm extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            track: ''
        };
        this.handleChange = this.handleChange.bind(this)
        this.submitSuggestion = this.submitSuggestion.bind(this)

    }

    handleChange(event){
        this.setState({
            track: event.target.value
        })
    }

    submitSuggestion() {
        console.log('submitted' + this.props.userId + this.props.receiverId)
        post('/api/suggestion', {receiver: this.props.receiverId, sender: this.props.userId, track: this.state.track, time: '0'})

    }
    render() {
        return(
            
<Input
    action={{ color: 'teal', content: 'submit', onClick: this.submitSuggestion}}
    actionPosition='right'
    placeholder='Search...'
    onChange={this.handleChange}
  />
        )
    }
}
export default SuggestionForm;