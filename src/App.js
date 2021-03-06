import React, {Component} from 'react';
// import {TextInput} from 'react-native';
import 'reset-css/reset.css';
//import './App.css';
import queryString from 'query-string'
import request from 'request'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
//const superagent = require('superagent');

let defaultTextColor = '#fff'
let defaultStyle = {
  color: defaultTextColor,
}

let fakeServerData = {
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

class Filter extends Component {
  render() {
    return (
      <div style= {{padding: '5px', height: '40px', verticalAlign: "bottom"}}>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}
        placeholder="Filter"
        style= {{padding: '0px',}}
        />
      </div>  
    );
  }
}

function PlaylistHeader (props) {
  let totalDuration = props.playlist.songs.reduce((sum, song) => {
    return sum + song.duration;
  }, 0);
  totalDuration = Math.round(totalDuration/1000/60);
  const numOfSongs = props.playlist.songs.length
  return (
    <div style={{...defaultStyle, width: "auto", marginLeft: '0vw'}}>
      <img src={props.playlist.imgUrl} className='PlaylistImg'/>
      <div style={{display: 'inline-block', verticalAlign: 'top', height: "140px"}}>
        <p style={{
          textAlign: 'center', fontSize: '30px', padding: '10px', fontWeight:'bold', 
        }}>
          {props.playlist.name}
        </p>
        <p style={{textAlign: 'left'}}>
        {numOfSongs} songs <br/>
        {totalDuration} mins
        </p>
      </div>
    </div>
    );
}

class Song extends Component {
  render () {
    return (
      <button className="song" onClick={this.props.onClick} style={{
        fontSize: '15px',
        padding: '3px',
      }, 
      this.props.renderVal ? {color: 'green'} : {backgroundColor: 'rgba(255,255,255,0.9)',}  
      }>
        {this.props.value}
      </button>
    );
  }
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8; // Used for padding

const getItemStyle = (isDragging, draggableStyle, inFilter) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,

  // change padding based on filter
  padding: inFilter ? grid * 2 : grid,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : inFilter? "green" : "darkseagreen",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#202020" : "black",
  padding: grid,
  width: '75vw'
});

class SongList extends Component {
  render () {
    return (
      <DragDropContext onDragEnd={this.props.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.props.songs.map((song, index) => (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          song.render,
                        )}
                      >
                        {index + 1}. {song.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
    );
  }
}

class Playlist extends Component {

  render () {

    const items = this.props.playlist.songs.map( song => ({
      id: song.id,
      content: song.name,
    }));

    return (
      <div style={{...defaultStyle, marginLeft: '10vw', marginRight: '10vw'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
        <div style={{display: 'inline-block'}}>
          <PlaylistHeader playlist={this.props.playlist} />
          <Filter onTextChange={text => this.props.onTextChange(text)}/>
        </div>
        <div style={{display: 'inline-block', textAlign: 'center'}}>
        <button onClick={() => this.props.handleClick()} 
          onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
          onMouseLeave={ (e) => e.target.style.border='3px solid #fff' } 
          style={{ width:'20vw', padding:'3px', borderRadius: '3px', border: '3px solid #fff', 
          fontSize: '22px', fontWeight: 'bold'
        }}>
          { this.props.buttonVal ? "Saved" : "Save"}
        </button>
        <p style={{
          padding: '9px', fontStyle: 'italic',
        }}>You can change your response later</p>
        </div>
      </div>
      <SongList onDragEnd={this.props.onDragEnd} songs={this.props.playlist.songs} />
      </div>
    );
  }
}

class App extends Component {

  constructor () {
    super();
    this.state = {
      filterString: '',
      songsSaved: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount () {
    
    // Refresh token? May need to set this automatically
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    console.log(accessToken);
    if (!accessToken){return;}

    const userid = parsed.user_id; // only returned in deployment
    const username = parsed.username;
    console.log(userid);
    console.log(username);

    // Get user data
    if (userid){
      this.setState({user: {name: username, id: userid}});
      console.log(this.state);
      //console.log(this.state.user.id); // setstate is asynchronous, so causes debug issues
    }else{
      request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
      }, 
      (error, response, body) => {
      console.log(body);
      this.setState({user: {name: body.display_name, id: body.id}});
      console.log(this.state);
      });
    }

    // Get collabroative playlist data
    request.get({
      url: (window.location.href.includes('localhost')
        ? 'http://localhost:8888'
        : 'https://shared-playlist-backend.herokuapp.com')
        + '/api/playlist?access_token=' + accessToken + '&user_id=' + (userid ? userid : ''),
      json: true
    }, (error, response, body) => {
      console.log("Got playlist data from api");
      console.log(body);
      this.setState({
      playlist: {
        name: body.name,
        imgUrl: body.imgUrl,
        songs: body.songs.map( (item, index) => ({
          id: item.id,
          name: item.name,
          duration: item.duration,
          score: item.score,
          render: true,
        })).sort( (a,b) => a.score - b.score),
      }
      });
      console.log(this.state);
    });

    // setTimeout ( () => {this.setState({serverData:fakeServerData});}, 1000);
    // setTimeout ( () => {this.setState({filterString:'fav2'});}, 1200); // To test filtering
  }

  handleFilter(inpText) {

    this.setState({filterString: inpText})

    const songsToRender = 
      this.state.user &&
      this.state.playlist &&
      this.state.playlist.songs
        ? this.state.playlist.songs.filter( song =>
          song.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : [] ;
    
    let playlist = {...this.state.playlist}
    playlist.songs.forEach( 
      (song) => {song.render = songsToRender.includes(song) ? true : false}
    );
    this.setState({playlist});

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
          id: this.state.user.id,
          songs: this.state.playlist.songs,
        },
        json: true,
    },
    (error, response, body) => {
      console.log(body);
      this.setState({songsSaved: (body === "OK" ) ? true : false})   
    }
    );
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let items = reorder(
      this.state.playlist.songs,
      result.source.index,
      result.destination.index
    );

    // Update score (done on SERVER side FOR NOW)
    // const maxScore = items.length;

    // items.forEach( (item, index) => {
    //   item.score = index;
    // })

    if (items !== this.state.playlist.songs)
    {
      this.setState({songsSaved: false});
      let playlist = {...this.state.playlist};
      playlist.songs = items;
      this.setState({playlist});
    }    
    console.log(this.state);
  }

  render() {      

    let songsToRender = this.state.playlist ? this.state.playlist.songs.filter( song => song.render) : [];

    return (
      <div className="App">
        {this.state.user && this.state.playlist ?
        <div>
          <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px', marginLeft: '10vw'}}> 
            {this.state.user.name}'s List
          </h2>
          <Playlist 
            playlist={this.state.playlist} 
            onTextChange={text => this.handleFilter(text)} 
            onDragEnd={this.onDragEnd} 
            handleClick={() => this.handleClick()} buttonVal ={this.state.songsSaved}
          />
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
        
      </div>
    );
  }
  
}

export default App;
