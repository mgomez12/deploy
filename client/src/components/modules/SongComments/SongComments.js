import React, { Component } from 'react';
import _ from 'lodash'
import "../../../public/css/styles.css"
import default_profile from "../../../public/assets/default_profile.png";
import { Comment, Icon, Message, Button } from 'semantic-ui-react';
import { get } from "../api"

class SongComment extends Component {
    constructor(props) {
        super(props);


        this.state = {
            comments: [],
            currentComment: {},
            currentProfile: {},
            initialized: false,
            commentsToDisplay: false
        };


    }
    componentDidMount() {
        this.getCommentsArrayLength(this.props.songId)
        this.interval = setInterval(() =>  this.getCommentsArrayLength(this.props.songId), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getCommentsArrayLength(id) {
        fetch('/api/song_info_length?id=' + id ).then(res => {
            console.log("res: "+res)
            if(res) {
                return res.json()
            }
            else {
                console.log("in comments")
                this.setState({
                    commentsToDisplay: false
                })
            }
        })
        .then( (comments) => {this.getSongInfo(id, comments)})
    }

    getSongInfo(id, comments) {
        if(!comments) {
            console.log("bruhsh: " + comments)
            this.setState({
                commentsToDisplay: false
            })
        }
        else {
            const length = comments.length;
            const randomNumber = _.random(0,length-1);
            fetch('/api/song_info?id=' + id + "&random=" + randomNumber).then(res => res.json())
            .then((comment) => {
                this.setState({
                    currentComment: comment
                })
                return comment
            }).then( (comment) => {
                console.log(comment)
                this.displayRandomComment(comment)})
        }
    }


    displayRandomComment(comment) {
            console.log("hoe")
            const id = comment.userId;
            console.log(id)
            fetch('/api/user?_id=' + id)
            .then(res => res.json())
            .then((profile) => {
                this.setState({
                    currentProfile: profile
                })
            }).then( () => {
                this.setState({
                    initialized: true,
                    commentsToDisplay: true
                })
                console.log("after promises")
            })
    }

    render() {
        var image, name, content, time = "";
        console.log("initialized: "+this.state.initialized)
        if (!this.state.commentsToDisplay) {
            return(
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar as='a' src={default_profile} />
                        <Comment.Content>
                            <Comment.Author as='a'>Groove Team</Comment.Author>
                            <br/>
                            <Comment.Metadata>
                                <div>Posted Today</div>
                            </Comment.Metadata>
                            <Comment.Text>No comments to this song! Post one!<br/></Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            )
        }
        if(this.state.initialized) {
            console.log("down here")
            name = this.state.currentProfile.name;
            image = (this.state.currentProfile.image !== '' ? this.state.currentProfile.image : default_profile);
            content = this.state.currentComment.content;
            var date = new Date(this.state.currentComment.time.toString());
            time = date.toDateString();
        }
        return(
            <Comment.Group>
                <Comment>
                    <Comment.Avatar as='a' src={image} />
                    <Comment.Content>
                        <Comment.Author as='a'>{name}</Comment.Author>
                        <br/>
                        <Comment.Metadata>
                            <div>Posted {time}</div>
                        </Comment.Metadata>
                        <Comment.Text>{content}</Comment.Text>
                    </Comment.Content>
                </Comment>
            </Comment.Group>
        )
    }
}
export default SongComment;