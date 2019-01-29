import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Message, Input, Loader, Form, TextArea, Button } from 'semantic-ui-react';
import { post } from "./api"

class DescriptionInputForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: this.props.userProfile.descrip,
            submitted: false,
            response: null,
            edit: false,
            description: this.props.userProfile.descrip
        };
        this.handleChange = this.handleChange.bind(this)
        this.submitDescription = this.submitDescription.bind(this)
        this.editDescription = this.editDescription.bind(this)
        this.cancel = this.cancel.bind(this)

    }

    handleChange(event){
        this.setState({
            input: event.target.value,
        })
    }

    editDescription() {
        this.setState({
            edit: true,
        })
    }

    submitDescription() {
        const input = this.state.input
        this.setState({
            submitted: false,
            response: null,
            edit: false,
            description: input
        })
        console.log('submitted' + this.props.userId + input)
        post('/api/description', {user_id: this.props.userId, bio:input},
        (response) => {  
            console.log(response);
            if (response.status =='success') {
                this.setState({
                    response: true,
                    edit: false
                })
                return
            }
            this.setState({
                response: false
            })
        })
    }

    cancel() {
        this.setState({
            edit: false
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
        if (this.props.userId==this.props.personId){
            if (this.props.userProfile.descrip=="" || this.state.edit){
                console.log("HESFJLKSEJF"+ this.props.userProfile.descrip)
                return(
                    <React.Fragment>
                    <div style={{display:'inline-block'}}>
                        <Form.Field
                            control={TextArea}
                            action={{ color: 'teal', content: 'submit', onClick: this.submitDescription}}
                            placeholder="Type in your bio!"
                            value={this.state.input}
                            onChange={this.handleChange}
                        />
                        <Form.Field control={Button} onClick={this.submitDescription}>Confirm</Form.Field>
                        <Form.Field control={Button} onClick={this.cancel}>Cancel</Form.Field>

                        
                    </div>
                    </React.Fragment>
                )
                console.log("HESFJLKSEJF"+ this.props.userProfile.descrip)
            }
            else {
                console.log("HESFJLKSEJF"+ this.props.userProfile.descrip)
                return(
                    <div>
                        <p>{this.state.description}</p>
                        <Button onClick={this.editDescription}>Edit Description</Button>
                        {banner}
                    </div>
                )
            }

        }
        else{
            if (this.props.personProfile.descrip==null){
                return(
                    <div></div>
                )
            }
            else{
                return(
                    <div><p>{this.props.personProfile.descrip}</p></div>
                )
            }   
        }
    }
}
export default DescriptionInputForm;