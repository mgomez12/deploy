import React, { Component } from 'react';
import "../../public/css/styles.css";
import {Link} from "react-router-dom"
import { Loader, Feed, Image } from 'semantic-ui-react';
import { get } from "./api"
import default_profile from "../../public/assets/default_profile.png";
import circle_llama from "../../public/assets/circle_llama.png";
import confused_llama from "../../public/assets/confused_llama.png";
import confused from "../../public/assets/confused.png";



class SuggestionEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            senderInfo: null,
            trackInfo: null
        };

    }

    componentDidMount() {
        const obj=this;
        console.log(obj.props.sug.sender_id)
        console.log("Hey")
        if (obj.props.sug.sender_id === 'anonymous') {
            obj.setState({
                senderInfo: {
                    image: confused_llama
                }
            })
        }
        else {
        get('/api/user', {_id: this.props.sug.sender_id, fields:'name image'}, user => {
            obj.setState({
                senderInfo: user
            })
            })
        }
        const token_header = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
        get('https://api.spotify.com/v1/tracks/' + this.props.sug.track_id, null, function(songData) {
            obj.setState({
                trackInfo: songData
            })
        }, null, token_header)
    }
    render() {
        let user=''
        if (this.props.userInfo.access_token == null || this.state.senderInfo ==null || this.state.trackInfo == null ) {
            return(<Loader size='massive'/>)
        }

        if (this.props.sug.sender_id == 'anonymous') {
            user= 'Someone secret '
        }
        else {
            user=<Feed.User href={"/u/profile/" + this.props.sug.sender_id} style={{padding:'4px'}}>
                {this.state.senderInfo.name}
                </Feed.User>
        }
        return(<Feed.Event >
            <Feed.Label>
                <Image size='mini' circular src={this.state.senderInfo.image == '' ? circle_llama : this.state.senderInfo.image}/>
            </Feed.Label>
            <Feed.Content>
                <Feed.Summary >
                        {user}
                        suggested the song 
                        <Link to={"/song/" + this.props.sug.track_id} style={{padding:'4px'}}>
                        {this.state.trackInfo.name}
                        </Link>
                </Feed.Summary>
            </Feed.Content>
        </Feed.Event>)

    }
}
export default SuggestionEntry;