import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Results from './Results'
import * as serviceWorker from './serviceWorker';

const defaultStyle = {
  color: '#fff',
  padding: '20px',
}

function HomeButton(props) {
  return (
    <button onClick={props.onClick}>
      Home
    </button>
  );
}

function ResultsButton(props) {
  return (
    <button onClick={props.onClick} 
      onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
      onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
      style={props.style}
    >
      Results
    </button>
  );
}

// Simple home page to decide what to render
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'HOME', // HOME/APP/RESULTS
    };
  }

  handleClick(destination){
    this.setState({display: destination});
    console.log(this.state);
  }

  render() {
    return (
      <header style={{...defaultStyle, verticalAlign: 'middle', display: 'flex', justifyContent: 'space-between'}}>
        <h1 style={{display: 'inline-block', padding: '20px', fontSize: '30px'}}>
          Shared Spotify Playlist
        </h1>
        <p>I'm storing cookies whether you like it or not</p>

        <ResultsButton 
          onClick={ () => {this.handleClick('RESULTS')}}
          style={{
            padding: '10px', fontSize: '20px', borderRadius: '5px', border: '3px solid #fff', 
            display: 'inline-block'
          }}
        />
      </header>
    );
  }

}

ReactDOM.render(
  
  <React.StrictMode>
    <Home />
    <App />
    {/* <Results /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
