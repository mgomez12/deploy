import React, { Component } from 'react';
import _ from 'lodash'
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Message, Button } from 'semantic-ui-react';
import { get } from "./api"

class SongComment extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            added: false
        };


    }
    componentDidMount() {
        
    }

    render() {
        return(
        <div style={{display:'inline-block'}}>
        </div>
        )
    }
}
export default SongComment;