import React, {Component} from 'react';
// import {TextInput} from 'react-native';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string'
import request from 'request'
import SimpleTable from "./Components/TableComp"


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

const fakeResultsData = {
  "songScores":[{"songid":"2qT1uLXPVPzGgFOx4jtEuo","songname":"no tears left to cry","addedbyuserid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":17},{"songid":"1E3ajDjSDQhM9XLZYWnWhg","songname":"Up in Flames","addedbyuserid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":0},{"songid":"3XfCpIjEJvAcGnQuEV8xVo","songname":"Bad Together","addedbyuserid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":9},{"songid":"7y9iMe8SOB6z3NoHE2OfXl","songname":"Bad At Love","addedbyuserid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":0},{"songid":"7tgtLzGvrs36ni5zp9X8af","songname":"Coronavirus","addedbyuserid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":8},{"songid":"4zCEJUxsW73s2sIIoM4SLC","songname":"Mistakes","addedbyuserid":"ghifax","username":"ghifax","score":8},{"songid":"2wenGTypSYHXl1sN1pNC7X","songname":"Slow Dance (feat. Ava Max) - Sam Feldt Remix","addedbyuserid":"ghifax","username":"ghifax","score":6},{"songid":"0bMbDctzMmTyK2j74j3nF3","songname":"Alone, Pt. II","addedbyuserid":"ghifax","username":"ghifax","score":14},{"songid":"2i5hQ1RoA0KCzVRXjktJoo","songname":"Start It Over (feat. CVBZ & Shy Martin)","addedbyuserid":"ghifax","username":"ghifax","score":11},{"songid":"22O2Zdfj3jnJZDSzlDMAJp","songname":"Heading Home","addedbyuserid":"ghifax","username":"ghifax","score":2},{"songid":"0lSZh5W0wDeurkGzLYY6hf","songname":"Turks (feat. Travis Scott)","addedbyuserid":"danishmalik01","username":"danishmalik01","score":0},{"songid":"4CxFN5zON70B3VOPBYbd6P","songname":"you were good to me","addedbyuserid":"danishmalik01","username":"danishmalik01","score":14},{"songid":"5JWPUEov2wlX7c0jhYZpeB","songname":"Lost In Yesterday","addedbyuserid":"danishmalik01","username":"danishmalik01","score":15},{"songid":"13nqSnXz9VOVEZT5gwCRgf","songname":"projector","addedbyuserid":"danishmalik01","username":"danishmalik01","score":6},{"songid":"73M2Vb5MfZh8iGKudkMtlw","songname":"Always Like This","addedbyuserid":"danishmalik01","username":"danishmalik01","score":0},{"songid":"4s7U2mS26ab7GFtgeUcwKA","songname":"Ecstasy","addedbyuserid":"tharshank85","username":"tharshank85","score":5},{"songid":"3Bzil9UjZsRWDJjC4qcrdR","songname":"Call Me Back","addedbyuserid":"tharshank85","username":"tharshank85","score":16},{"songid":"4pBsg7FS4R99zk55McLRIy","songname":"God Must Be Doing Cocaine","addedbyuserid":"tharshank85","username":"tharshank85","score":9},{"songid":"5wU72B3PYgD5lXxHicD5PU","songname":"Late Nights","addedbyuserid":"tharshank85","username":"tharshank85","score":12},{"songid":"6qwan9tOcWSRDBZMYwYrLD","songname":"Chewing Cotton Wool","addedbyuserid":"tharshank85","username":"tharshank85","score":29},{"songid":"0zI9Oc8EePyYMPcALIBtpa","songname":"Snowchild","addedbyuserid":"vishukethees","username":"vishukethees","score":36},{"songid":"11RIJRbBfyLlJut96itSFd","songname":"Energy (Stay Far Away)","addedbyuserid":"vishukethees","username":"vishukethees","score":25},{"songid":"5LBikzSkad9yQ6RH87Gdrm","songname":"Rain","addedbyuserid":"vishukethees","username":"vishukethees","score":24},{"songid":"1hz7SRTGUNAtIQ46qiNv2p","songname":"GONE, GONE / THANK YOU","addedbyuserid":"vishukethees","username":"vishukethees","score":28},{"songid":"0zXE8mMAXCtfzc02MddxWn","songname":"Repeat (feat. Koffee)","addedbyuserid":"vishukethees","username":"vishukethees","score":42}],
  "userScores":[{"userspotifyid":"21l7ckkzm3n724zgz6lbosx4a","username":"Akash Gupta","score":34},{"userspotifyid":"ghifax","username":"ghifax","score":41},{"userspotifyid":"danishmalik01","username":"danishmalik01","score":35},{"userspotifyid":"tharshank85","username":"tharshank85","score":71},{"userspotifyid":"vishukethees","username":"vishukethees","score":155}]
}

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
        confirmed: false
      };
    }
  
    componentDidMount () {

        // Get data of top songs
        // Check if localhost or on server:
        console.log("Commponent Mounted");
        if (window.location.href.includes('localhost')){
          console.log("Using fake date");
          this.setState({songScores: fakeResultsData.songScores, userScores: fakeResultsData.userScores});
        }else{
          request.get(
            {
                url: 'https://shared-playlist-backend.herokuapp.com/api/result',
                json: true
            }, 
            (error, response, body) => {
              console.log("Using server date");
              console.log(body);
              this.setState({songScores: body.songScores, userScores: body.userScores});
           });
        }
    }

    // Handle Restart Playlist 
    handleClick () {
        // Type in Playlist name to proceed


      // POST request to send order of songs
      // request.post({
      //   url: (
      //     window.location.href.includes('localhost')
      //       ? 'http://localhost:8888' 
      //       : 'https://shared-playlist-backend.herokuapp.com'
      //       ) + '/api/playlist',
      //     form: {
      //       id: this.state.user.name,
      //       songs: this.state.playlist.songs,
      //     },
      //     json: true,
      // },
      // (error, response, body) => {
      //   console.log(body);
      // }
      // );
    }
  
    render() {      
  
      return (
        <div className="App">

            <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
                Overall Winner
            </h1>
            {this.state.userScores &&
            <div style={{padding: '20px'}}>
            <SimpleTable 
                rows={this.state.userScores.map( userScore => {
                 return {
                   key: userScore.userspotifyid,
                   values: [userScore.username, this.state.confirmed ? userScore.score : '-']
                 }
                }).sort( (a,b) => - a.values[1] + b.values[1])} // Sort in reverse order
                head = {["Name", "Score"]}
                />
            </div>
            }

            <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
                Top Songs
            </h1>
            {/*Scrollable list order of songs*/}
            {this.state.songScores && 
            <div style={{padding: '20px'}}>
              <SimpleTable 
                rows={this.state.songScores.map( songScore => {
                 return {
                   key: songScore.songid,
                   values: [songScore.songname, this.state.confirmed ? songScore.score : '-', songScore.username]
                 }
                }).sort( (a,b) => - a.values[1] + b.values[1])} // Sort in reverse order
                head = {["Name", "Score", "User"]}
                />
            </div>
            }
            <div 
                style={{...defaultStyle, verticalAlign: 'middle', 
                    display: 'flex', justifyContent: 'space-between', color:'black'
                }}>
            <ResultsButton
                onClick = {() => this.handleClick()}
                value='Update Songs'
            />
            <ResultsButton
                onClick = {() => this.handleClick()}
                value='Get Results'
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
  