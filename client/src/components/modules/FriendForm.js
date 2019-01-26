import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Message, Button } from 'semantic-ui-react';
import { get } from "./api"

class FriendForm extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            added: null
        };

        this.addFriend = this.addFriend.bind(this)

    }
    componentDidMount() {
        this.areFriends();
        console.log(this.props.viewerInfo.friends)

    }
    areFriends() {
        get('/api/friend', {_id: this.props.userId},(friendObj) => {
            console.log(friendObj)
            if(friendObj.friends.includes(this.props.receiverId)) {
                console.log("are friends")
                this.setState({
                    added: 'friends'
                })
            }
            else if (friendObj.sent_request_to.includes(this.props.receiverId)) {
                this.setState({
                    added: 'sent'
                })
            }
            else if (friendsObj.received_request_from.includes(this.props.receiverId)) {
                this.setState({
                    added: 'waiting'
                })
            }
        })
    }

    addFriend() {
        this.setState({
            added: 'friends'
        })
        fetch('/api/friend', {method: 'POST',
            body: JSON.stringify({
                receiver: this.props.receiverId,
                sender: this.props.userId}),
            headers: { "Content-Type": "application/json" }})
        .then((res) => {
            console.log('friend added');
            get('/api/updateUser', {}, response => {console.log(response)});
        })
    }
    render() {
        let message = '';
        status = this.state.added;
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
        return(
        <div style={{display:'inline-block'}}>

            {message}
        </div>
        )
    }
}
export default FriendForm;