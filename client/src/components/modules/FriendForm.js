import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Header, Message, Button } from 'semantic-ui-react';
import { get } from "./api"

class FriendForm extends Component {
    constructor(props) {
        super(props);


        this.state = {
            added: null
        };

        this.addFriend = this.addFriend.bind(this)

    }
    componentDidMount() {
        this.areFriends();

    }
    areFriends() {
        get('/api/friend', {_id: this.props.userId},(friendObj) => {
            if(friendObj.friends.includes(this.props.receiverId)) {
                this.setState({
                    added: 'friends'
                })
            }
            else if (friendObj.sent_request_to.includes(this.props.receiverId)) {
                this.setState({
                    added: 'sent'
                })
            }
            else if (friendObj.received_request_from.includes(this.props.receiverId)) {
                this.setState({
                    added: 'waiting'
                })
            }
        })
    }

    addFriend() {
        if (this.state.added === 'waiting') {
        this.setState({
            added: 'friends'
        }) }

        else {this.setState({added: 'sent'})}
        fetch('/api/friend', {method: 'POST',
            body: JSON.stringify({
                receiver: this.props.receiverId,
                sender: this.props.userId}),
            headers: { "Content-Type": "application/json" }})
        .then((res) => {
            get('/api/updateUser', {}, response => {console.log(response)});
        })
    }
    render() {
        let message, header = '';
        status = this.state.added;
        if(this.props.userId == this.props.receiverId) {
            message = <div></div>
            header = <div></div>
        }
        else {
            header = <Header as='h4'>Follow user!</Header>
            if (status == 'friends') {
                message = <Message compact positive><Message.Header>Friend</Message.Header></Message>
            }
            else if (status == 'sent') {
                message = <Message compact warning><Message.Header>Friend request sent!</Message.Header></Message>
            }
            else if (status == 'waiting') {
                message =  <div><Message compact warning><Message.Header>Friend request received</Message.Header></Message>
                <Button
                    color='teal'
                    content='Confirm'
                    onClick={this.addFriend}
                /></div>
            }
            else {
                message = <Button
                color='teal'
                content='Add Friend'
                onClick={this.addFriend}
            />
            }
        }

        return(
        <div style={{display:'inline-block'}}>
            {header}
            {message}
        </div>
        )
    }
}
export default FriendForm;