import _ from 'lodash'
import io from 'socket.io-client';
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import {get} from "./api";



class SearchBarSpotifySuggest extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');


        
        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: [{}]
        };
        
    }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
      
    this.setState({ 
        value: "",
        source: [{}]
   })
      this.props.history.push('/song/' + result.key);
      this.resetComponent();
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
    var query = value.replace(/ /g,"%20")
    var artistHeader = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
    get('https://api.spotify.com/v1/search?q=' + query + '&type=track&market=US&limit=5', null, function(searchData) {

        const compiled = searchData.tracks.items.map( track => {
            return(
                {
                    key: track.id,
                    title: track.name,
                    image: track.album.images[0].url,
                    description: track.album.artists[0].name,
                    uri: track.uri
                }
            );
        });
        obj.setState({
            isLoading: false,
            results: compiled
        })
    }, null, artistHeader);
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
        <div>
                <Search
                    loading={isLoading}
                    placeholder='Search for a song...'
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                />
        </div>
    )
  }
}
export default SearchBarSpotifySuggest;