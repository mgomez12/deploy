import _ from 'lodash'
import faker from 'faker'
import io from 'socket.io-client';
import React, { Component } from 'react'
import {Redirect } from "react-router-dom";
import { Form, Search, Grid, Header, Segment } from 'semantic-ui-react'
import {get} from "./api";



class SearchBarSpotify extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');


        // this.source = _.times(5, () => ({
        //     title: faker.company.companyName(),
        //     description: faker.company.catchPhrase(),
        //     image: faker.internet.avatar(),
        //     price: faker.finance.amount(0, 100, 2, '$'),
        //   }))
        
        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: [{
                title: "Jeffrey Chen",
                image: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=234005436790515&height=200&width=200&ext=1550675248&hash=AeQ2vzL0Qc9aF3s7"
            }]
        };
        
    }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
      
      this.setState({ value: result.title })
      console.log(result)
      
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value: value })

    setTimeout(() => {
        this.updateSourceTracks(value);
        this.render();
    }, 300)

  }

  updateSourceTracks(value) {
    if (value.length < 1) return this.resetComponent() 
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
    console.log('token: ' + this.props.userInfo.access_token)
    get('https://api.spotify.com/v1/search?q=' + value + '&type=track&market=US&limit=5', null, function(searchData) {

        console.log('search data in get: ' + searchData.tracks.items[0].name)
        const compiled = searchData.tracks.items.map( track => {
            return(
                {
                    key: track.id,
                    title: track.name,
                    image: track.album.images[0].url,
                    description: track.album.artists[0].name,
                }
            );
        });
        console.log(compiled)
        obj.setState({
            isLoading: false,
            results: compiled
        })
    }, null, artistHeader);
  }

  onClickFunc(track) {
    console.log("in onClickFunc")
    ;
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
        <div>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                />
        </div>
    )
  }
}
export default SearchBarSpotify;