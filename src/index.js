import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import logo from './logo.svg';
import Results from './Results'
import * as serviceWorker from './serviceWorker';

function AppFooter(props){ 
  return (
    <footer className="App-footer">
      <img src={logo} className="App-logo" alt="logo"/>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by React
      </a>
      <p>I'm storing cookies whether you like it or not</p>
    </footer>
  );
}

const defaultStyle = {
  color: '#fff', padding: '10px', display: 'inline-block', 
}

function HomeButton(props) {
  return (
    <button onClick={props.onClick} 
      onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
      onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
      style={{...defaultStyle, fontSize: '20px', borderRadius: '3px', border: '3px solid #fff',
       ...(props.style ? {color:'green'} : {color:'black'}),
      }}
    >
      {props.value}
    </button>
  );
}

// Simple home page to decide what to render
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'App', // App/Results
    };
  }

  handleClick(destination){
    this.setState({display: destination});
    console.log(this.state);
  }

  render() {
    return (
      <div>
      <div>
        <header style={{...defaultStyle, verticalAlign: 'middle', display: 'flex', justifyContent: 'space-between'}}>
          <h1 style={{display: 'inline-block', padding: '20px', fontSize: '30px'}}>
            Shared Spotify Playlist
          </h1>
          <div>
          <HomeButton 
            onClick={ () => {this.handleClick('Results')}} 
            value='Results'
            style={ this.state.display === 'Results'}
          />
          <HomeButton 
            onClick={ () => {this.handleClick('App')}} 
            value='My List'
            style={this.state.display === 'App'}
          />
          </div>

        </header>
      </div>
      <div>
        {this.state.display === 'App' ? <App /> : <Results />}
      </div>
      </div>
    );
  }

}

ReactDOM.render(
  
  <React.StrictMode>
    <Home />
    <AppFooter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
