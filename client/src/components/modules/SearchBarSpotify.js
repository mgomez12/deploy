import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import {get, get2} from "./api";
import default_profile from  '../../public/assets/default_profile.png'
import circle_llama from "../../public/assets/circle_llama.png";



class SearchBarSpotify extends Component {
    constructor(props) {
        super(props);

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
      if(result.type == 'song') {
            this.props.history.push('/song/' + result.key);
      }
      if(result.type == 'album') {
            this.props.history.push('/album/' + result.key);
      }
      if(result.type == 'artist') {
            this.props.history.push('/artist/' + result.key);
      }
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value: value })

    var query = value.replace(/ /g,"%20")
    setTimeout(() => {
        if (value.length < 1) return this.resetComponent() 

        const obj = this;
        var headers = {Authorization : 'Bearer ' + this.props.userInfo.access_token};
        const promises = [
            get2('https://api.spotify.com/v1/search?q=' + query + '&type=track&market=US&limit=3',null,headers),
            get2('https://api.spotify.com/v1/search?q=' + query + '&type=album&market=US&limit=2',null,headers),
            get2('https://api.spotify.com/v1/search?q=' + query + '&type=artist&market=US&limit=2',null,headers)
        ]
        Promise.all(promises).then(responses => {
            const compiled = responses[0].tracks.items.map( track => {
                return(
                    {
                        key: track.id,
                        title: track.name,
                        image: (track.album.images.length > 0 ? track.album.images[0].url : circle_llama),
                        description: track.album.artists[0].name,
                        type: 'song',
                        uri: track.uri
                    }
                );
            });
            const compiledAlbums = responses[1].albums.items.map( album => {
                return(
                    {
                        key: album.id,
                        title: album.name,
                        image: (album.images.length > 0 ? album.images[0].url : circle_llama) ,
                        description: album.artists[0].name,
                        type: 'album',
                        uri: album.uri
                    }
                );
            });
            const compiledArtists = responses[2].artists.items.map( artist => {
                return(
                    {
                        key: artist.id,
                        title: artist.name,
                        image: (artist.images.length > 0 ? artist.images[0].url : circle_llama),
                        description: artist.genres[0],
                        type: 'artist',
                        uri: artist.uri
                    }
                );
            });
    
            return {
                tracks: {
                    name: "Tracks",
                    results: compiled
                },
                artists: {
                    name:"Artists",
                    results: compiledArtists
                },
                albums: {
                    name:"Albums",
                    results: compiledAlbums
                }
            }
        }).then( filteredResults => {
            obj.setState({
              isLoading: false,
              results: filteredResults,
            })})
    }, 300)

  }

  

  render() {
    const { isLoading, value, results } = this.state

    return (
        <div>
                <Search
                    category
                    fluid ={true}
                    loading={isLoading}
                    placeholder='Search for a song, album, or artist...'
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