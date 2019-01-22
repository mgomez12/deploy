import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Message, Input } from 'semantic-ui-react';
import { post } from "./api"

class SuggestionForm extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            input: '',
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this)
        this.submitSuggestion = this.submitSuggestion.bind(this)

    }

    handleChange(event){
        if (this.state.input == '') {
            this.setState({
                input: event.target.value,
                submitted: false
            })
            return
        }
        this.setState({
            input: event.target.value,
        })
    }

    submitSuggestion() {
        this.setState({
            input: '',
            submitted: true
        })
        if (!this.props.isTrack) {
            console.log('submitted' + this.props.userId + this.state.input)
            post('/api/suggestion', {receiver: this.state.input, sender: this.props.userId, track: this.props.track, time: '0'})
        }
        else {
        console.log('submitted' + this.props.userId + this.props.receiverId)
        post('/api/suggestion', {receiver: this.props.receiverId, sender: this.props.userId, track: this.state.input, time: '0'})
        }
    }
    render() {
        return(<div style={{display:'inline-block'}}>
<Input
    action={{ color: 'teal', content: 'submit', onClick: this.submitSuggestion}}
    placeholder={this.props.isTrack? "Type in track id..." : "Type in user id..."}
    value={this.state.input}
    onChange={this.handleChange}
  />
  {this.state.submitted ? <Message compact positive><Message.Header>Submitted!</Message.Header></Message> : ''}
  </div>
        )
    }
}
export default SuggestionForm;