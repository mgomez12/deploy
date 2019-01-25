import React, { Component } from 'react';
import _ from 'lodash'
import "../../../public/css/styles.css"
import io from 'socket.io-client';
import default_profile from "../../../public/assets/default_profile.png";
import { Comment, Icon, Message, Button } from 'semantic-ui-react';
import { get } from "../api"

class SongComment extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            comments: [],
            currentComment: {},
            currentProfile: {},
            initialized: false,
            commentsToDisplay: false
        };


    }
    componentDidMount() {
        this.getSongInfo(this.props.songId);
    }

    getSongInfo(id) {
        fetch('/api/song?id=' + id).then(res => res.json())
        .then((commentArray) => {
            this.setState({
                comments: commentArray
            })
        }).then( () => {this.displayRandomComment()})
    }


    displayRandomComment() {
        if (this.state.comments.length > 0) {
            this.setState({
                commentsToDisplay: false
            })
        }
        else {
            var pickRandomComment = new Promise( () => {
                const randomNumber = _.random(0,this.state.comments.length-1);
                this.setState({
                    currentComment: this.state.comments[randomNumber]
                })
                return this.state.currentComment;
            }).then((comment) => {
                const id = comment.userId;
                return fetch('/api/user?_id=' + id)
            }).then(res => res.json())
            .then((profile) => {
                this.setState({
                    currentProfile: profile
                })
            }).then( () => {
                this.setState({
                    initialized: true,
                    commentsToDisplay: true
                })
            })
        }
    }

    render() {
        var image, name, content, date = "";
        var loves = 0;
        if (!this.state.commentsToDisplay) {
            return(
                <div>
                    <Comment.Group>
                        <Comment>
                            <Comment.Avatar as='a' src={default_profile} />
                            <Comment.Content>
                                <Comment.Author as='a'>Groove Team</Comment.Author>
                                <Comment.Metadata>
                                    <div>Posted {date}</div>
                                    <div>
                                        <Icon name='heart' />
                                        {loves} Loves!
                                    </div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    No comments to this song! Post one!
                                </Comment.Text>
                            </Comment.Content>
                        </Comment>
                    </Comment.Group>
                </div>
            )
        }
        if(this.state.initialized) {
            name = this.state.currentProfile.name;
            image = (this.state.currentProfile.image !== '' ? this.state.currentProfile.image : default_profile);
            content = this.state.currentComment.content;
            loves = this.state.currentComment.loves;
        }
        return(
            <Comment>
                <Comment.Avatar as='a' src={image} />
                <Comment.Content>
                    <Comment.Author>{name}</Comment.Author>
                    <Comment.Metadata>
                        <div>Posted {date}</div>
                        <div>
                            <Icon name='heart' />
                            {loves} Loves!
                        </div>
                    </Comment.Metadata>
                    <Comment.Text>
                        {content}
                    </Comment.Text>
                </Comment.Content>
            </Comment>
        )
    }
}
export default SongComment;