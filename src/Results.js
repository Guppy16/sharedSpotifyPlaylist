import React, {Component} from 'react';
// import {TextInput} from 'react-native';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string'
import request from 'request'

const fakeServerData = {
    user: {
      name: 'Akash',
      playlists: [
        { // Playlist 1 for the current songs added
          name: "Fav1",
          songs: [
            {name: 'Son1', duration: 120},
            {name: 'Song 2', duration: 69}, 
            {name:'Song3', duration: 42},
          ]
        },
        { // Playlist for the previous songs
          name: "Fav2",
          songs: [
            {name: 'Son1', duration: 120},
            {name: 'Song2', duration: 42}, 
            {name:'Song3', duration: 69},
          ]
        }
      ]
    }
  };

const defaultStyle = {
    color: '#fff',
}

class Results extends Component {

    constructor () {
      super();
      this.state = {
        user: fakeServerData.user,
        playlist: fakeServerData.playlists,
      };
    }
  
    componentDidMount () {
      
      // Refresh token? May need to set this automatically
      const parsed = queryString.parse(window.location.search);
      const accessToken = parsed.access_token;
      console.log(accessToken);
      if (!accessToken){return;}
  
      // Get user data
      request.get(
        {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + accessToken },
          json: true
        }, 
        (error, response, body) => {
        console.log(body);
        this.setState({user: {name: body.display_name}})
      });
  
      // Get collabroative playlist results
    //   request.get({
    //     url: (window.location.href.includes('localhost')
    //       ? 'http://localhost:8888' 
    //       : 'https://shared-playlist-backend.herokuapp.com')
    //     + '/api/playlist?access_token=' + accessToken,
    //     json: true
    //   },
    //   (error, response, body) => {
    //     console.log(body);
    //     this.setState({playlist: {
    //       name: body.name,
    //       imgUrl: body.images[0].url, 
    //       songs: body.tracks.items.map(item => ({
    //         id: item.track.id,
    //         name: item.track.name,
    //         duration: item.track.duration_ms,
    //         render: true,
    //       })),
    //     }})
    //     console.log(this.state);
    //     }
    //   );
    }

  
    // Handle Submit button
    handleClick () {
      // POST request to send order of songs
      request.post({
        url: (
          window.location.href.includes('localhost')
            ? 'http://localhost:8888' 
            : 'https://shared-playlist-backend.herokuapp.com'
            ) + '/api/playlist',
          form: {
            id: this.state.user.name,
            songs: this.state.playlist.songs,
          },
          json: true,
      },
      (error, response, body) => {
        console.log(body);
      }
      );
    }
  
    render() {      
  
      return (
        <div className="App">
          <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
            Shared Spotify Playlist Results!
          </h1>
          {this.state.user && this.state.playlist ?
          <div>
            <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px', marginLeft: '10vw'}}> 
              {this.state.user.name}'s List
            </h2>
          </div> 
            : <div style={{textAlign:'center', padding: '20px'}}><button onClick={() => {
                return window.location = window.location.href.includes('localhost')
                  ? 'http://localhost:8888/login' 
                  : 'https://shared-playlist-backend.herokuapp.com/login' }
                  }
                onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
                onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
                style={{
                  padding: '20px', fontSize: '50px', borderRadius: '5px', border: '3px solid #fff', 
              }}>
                Sign in with Spotify
              </button></div>
          }
          <footer className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by React
            </a>
          </footer>
        </div>
      );
    }
    
  }
  
  export default Results;
  