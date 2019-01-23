import React, { Component } from "react";
import "../../public/css/styles.css";
import {Image} from "semantic-ui-react";
import default_profile from "../../public/assets/default_profile.png";
import { Link} from 'react-router-dom';

class DefaultProfileImage extends Component {
	constructor(props) {
        super(props);
    }
    render() {
        return (
            <Image src={default_profile}/>
        )
    }
}
export default DefaultProfileImage;