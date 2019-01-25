import React, { Component } from 'react';
import _ from 'lodash'
import "../../../public/css/styles.css"
import io from 'socket.io-client';
import default_profile from "../../../public/assets/default_profile.png";
import { Input, Loader, Comment, Icon, Message, Button } from 'semantic-ui-react';
import { get, post } from "../api"

class AddComment extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        // user info and song id passed in 
        this.state = {
            input: '',
            submitted: false,
            response: null,
            anonymous: false
        };
        console.log(this.props.songId + " "+ this.props.userId)
        this.handleChange = this.handleChange.bind(this)
        this.submitComment = this.submitComment.bind(this)

    }

    handleChange(event){
        if (this.state.input == '') {
            this.setState({
                input: event.target.value,
            })
            return
        }
        this.setState({
            input: event.target.value,
        })
    }

    submitComment() {
        const input = this.state.input;
        this.setState({
            input: '',
            submitted: true,
            response: null
        })
        const date = new Date()
        console.log('submitted' + this.props.userId + input)
        post('/api/song_info_comment?id='+ this.props.songId, {comment: { userId: this.props.userId, content: input, loves: 0, time:date}},
        (response) => {
            console.log(response);
            if (response.status =='success') {
                this.setState({
                    response: true
                })
                return
            }
            this.setState({
                response: false
            })
        })
    }
    render() {
        let banner;
        if (this.state.submitted) {
            console.log(this.state.response)
            if (this.state.response == null) {
                banner=<Message compact ><Loader active size='medium'/></Message>
            }
            else if (this.state.response) {
                banner=<Message compact positive><Message.Header>Submitted!</Message.Header></Message>
            }
            else {
                banner=<Message compact negative><Message.Header>Failed!</Message.Header></Message>
            }
        }
        else {
            banner=''
        }
        return(
            <React.Fragment>
            <div style={{display:'inline-block'}}>
            <Input
                action={{ color: 'teal', content: 'submit', onClick: this.submitComment}}
                placeholder={ "Type in comment..."}
                value={this.state.input}
                onChange={this.handleChange}
            />
            {banner}
            </div>
            </React.Fragment>
        )
    }
}
export default AddComment;