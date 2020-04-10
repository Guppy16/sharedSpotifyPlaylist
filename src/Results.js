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
    },
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
  };

const defaultStyle = {
    color: '#fff',
    padding: '10px',
}

function ResultsButton(props) {
    return (
      <button onClick={props.onClick} 
        onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
        onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
        style={{...defaultStyle, fontSize: '20px', borderRadius: '3px', border: '3px solid #fff',
        color:'black'
        }}
      >
        {props.value}
      </button>
    );
  }

class Results extends Component {

    constructor (props) {
      super(props);
      this.state = {
        user: fakeServerData.user,
        playlist: fakeServerData.playlists,
      };
    }
  
    componentDidMount () {

        // Get data of top songs

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

    // Handle Restart Playlist (Type in Playlist name to proceed)
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

    // Handle click to return to home
  
    render() {      
  
      return (
        <div className="App">
            <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
                Top Song: 
            </h1>
            {/* Scrollable list with order of songs*/}
            <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
                Overall Winner: 
            </h1>
            {/*Scrollable list order of people*/}

            <div 
                style={{...defaultStyle, verticalAlign: 'middle', 
                    display: 'flex', justifyContent: 'space-between', color:'black'
                }}>
            <ResultsButton
                onClick = {() => this.handleClick()}
                value='Reset Songs'
            />
             
            {this.state.user?
            <div>
                <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px', marginLeft: '10vw'}}> 
                Under development
                </h2>
            </div> 
                : <div style={{textAlign:'center'}}>
                    <ResultsButton onClick={() => {
                        return window.location = window.location.href.includes('localhost')
                        ? 'http://localhost:8888/login' 
                        : 'https://shared-playlist-backend.herokuapp.com/login' }
                        }
                        value='Sign in with Spotify'
                    /></div>
            }
            </div>
        </div>
      );
    }
    
  }
  
  export default Results;
  