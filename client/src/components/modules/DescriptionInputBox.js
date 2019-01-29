import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Grid, Image, Message, Input, Loader, Form, TextArea, Button } from 'semantic-ui-react';
import sad_llama from "../../public/assets/sad_llama.png";
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
            if (this.state.edit){
                console.log("HESFJLKSEJF"+ this.props.userProfile.descrip)
                return(
                    <React.Fragment>

                        <Form.Field
                            control={TextArea}
                            autoHeight
                            style={{width:"100%", height:"100%"}}
                            action={{ color: 'teal', content: 'submit', onClick: this.submitDescription}}
                            placeholder="Type in your bio!"
                            value={this.state.input}
                            onChange={this.handleChange}
                        />
                    <Button onClick={this.submitDescription} content="Confirm"/>
                    <Button onClick={this.cancel} content="Cancel"/> 
                    </React.Fragment>
                )
            }
            else {
                console.log("HESFJLKSEJF"+ this.props.userProfile.descrip)
                return(
                    <div>
                        <Grid celled>
                            <Grid.Row>
                                <Grid.Column>
                                    <p>{this.props.personProfile.descrip=="" ? <i>{"Enter a Custom Description!"}<Image centered size="mini" src={sad_llama}/> </i>:this.state.description}</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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
                    <Grid celled>
                        <Grid.Row>
                            <Grid.Column>
                                <p>{this.props.personProfile.descrip=="" ? <i>{this.props.personProfile.name + " has not entered a description yet" }<Image centered size="mini" src={sad_llama}/> </i>:this.props.personProfile.descrip}</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }   
        }
    }
}
export default DescriptionInputForm;